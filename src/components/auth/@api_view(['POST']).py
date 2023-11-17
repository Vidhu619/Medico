@api_view(['POST'])
# @parser_classes([FormParser,MultiPartParser])
# @permission_classes((HasAPIKey,))
@permission_classes((AllowAny,))
def registration(request):
    context = {}
    # to find the user type
    patient = request.data.get('patient', False)
    doctor = request.data.get('doctor', False)
    sales = request.data.get('sales', False)
    consultant = request.data.get('consultant', False)
    hospitalManager = request.data.get('hospitalManager', False)
    password = request.data.get('password', None)
    password2 = request.data.get('password2', None)

    userSerializer = RegistrationSerializers(data=request.data, context={'request':request})
    if patient:
        # check if an account with this email exists that is not otp verified.
        client = User.objects.filter(email=request.data.get('email', None), is_verified=False)
        if client:
            client.delete()

        referalId = request.data.get('referalId', None)
        if referalId is not None:
            try:
                doctorDetails = DoctorDetails.objects.get(referalId=referalId)
            except DoctorDetails.DoesNotExist:
                return JsonResponse({"Invalid referalId" : "Doctor with the given Icmr does not exists"}, status=status.HTTP_404_NOT_FOUND) 
        else:
            return JsonResponse({"referalId" : "referalId cannot be blank"}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['referalId'] = doctorDetails.id
        details = CustomerDetailsSerializer(data=data)   
    elif doctor:
        details = DoctorRegSerializer(data=request.data)
    elif sales:
        data = request.data.copy()
        data['passwordString'] = request.data.get('password', None)
        details = SalesTeamSerializer(data=data)
    elif consultant:
        data = request.data.copy()
        data['passwordString'] = request.data.get('password', None)
        details = ConsultantInfoSerializer(data=data)
    elif hospitalManager:
        data = request.data.copy()
        data['passwordString'] = request.data.get('password', None)
        details = HospitalDetailSerializer(data=data)
    else:
        return JsonResponse({"Error" : "Specify the type of user"}, status=status.HTTP_400_BAD_REQUEST)


    # validations
    userSerializerValidation = userSerializer.is_valid(raise_exception=True)
    detailSerializerValidation = details.is_valid(raise_exception=True)
    PasswordErrors = dict() 
    try:
        password_validators.validate_password(password=userSerializer.initial_data['password'], user=User)
    except exceptions.ValidationError as e:
        PasswordErrors.update({'password' : list(e.messages)}) 
    if not sales and not consultant and not hospitalManager and password != password2:
        PasswordErrors.update({'password': 'Passwords does not match.'})

    if userSerializerValidation and detailSerializerValidation and not PasswordErrors:
        user = userSerializer.save()
        if user is not None:
            details.save(user=user)
            context['otpId'] = user.id
            context['user'] = userSerializer.data
            context['details'] =  details.data
            if user.role == User.DOCTOR:
                # send email on confirmation/creation of account
                    subject = 'Account confirmation'
                    html_content = render_to_string('Emails/Doctor/AccountConfirmation.html', {
                        'title' : subject,
                        "firstname" : user.firstname.capitalize()
                    })
                    text_content = strip_tags(html_content)
                    email = EmailMultiAlternatives(subject, text_content, settings.EMAIL_HOST_USER, [user.email])
                    email.attach_alternative(html_content, "text/html")
                    # email.send()
                    # whatsAppMessage = "Just reaching out to inform you that {drName} is waiting for his account verification to join shebirth family,kindly take appropriate actions.\nTo know more :{link}\nThis is a SYSTEM GENERATED MESSAGE".format(
                    #     drName=user.firstname.capitalize() + " " + user.lastname,
                    #     link="link"
                    # )
                    # admin_numbers = User.objects.filter(admin=True,mobile__isnull=False).values_list('mobile')
                    # for number in admin_numbers:
                    #     number = 'whatsapp:91{number}'.format(number=doctor.mobile)
                    #     WhatsAppClient.messages.create(from_=from_number,body=whatsAppMessage,to=number)
            return JsonResponse(context, status=status.HTTP_201_CREATED)
        else:
            return JsonResponse({'error':userSerializer.errors})
    else:
        context = userSerializer.errors
        context.update(details.errors)
        context.update(PasswordErrors)
        return JsonResponse(context, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((HasAPIKey,))
def client_registration(request):
    context = {}
    password = request.data.get('password', None)
    password2 = request.data.get('password2', None)
    data = request.data.copy()
    data['role'] = User.CLIENT

    # Check if an account with this email exists that is not otp verified.
    client = User.objects.filter(email=request.data.get('email', None), is_verified=False)
    if client:
        client.delete()

    referalId = request.data.get('referalId', None)
    if referalId:
        try:
            doctorDetails = DoctorDetails.objects.get(referalId=referalId)
            data['referalId'] = doctorDetails.id
        except DoctorDetails.DoesNotExist:
            # If the doctor with the provided referalId doesn't exist, set referalId to None
            data['referalId'] = None
    else:
        data['referalId'] = None

    userSerializer = RegistrationSerializers(data=data, context={'request': request})
    details = CustomerDetailsSerializer(data=data)
    # Check if 'age' is provided in the request data. If not, set it to None.
    if 'age' not in data:
        data['age'] = None

    # Validations
    userSerializerValidation = userSerializer.is_valid(raise_exception=True)
    detailSerializerValidation = details.is_valid(raise_exception=True)
    PasswordErrors = dict()
    try:
        password_validators.validate_password(password=userSerializer.initial_data['password'], user=User)
    except exceptions.ValidationError as e:
        PasswordErrors.update({'password': list(e.messages)})
    if password != password2:
        PasswordErrors.update({'password': 'Passwords do not match.'})

    if userSerializerValidation and detailSerializerValidation and not PasswordErrors:
        user = userSerializer.save()
        details.save(user=user)
        context['otpId'] = user.id
        context['success'] = "Successfully registered"
        return JsonResponse(context, status=status.HTTP_201_CREATED)
    else:
        context = userSerializer.errors
        context.update(details.errors)
        context.update(PasswordErrors)
        return JsonResponse(context, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes((HasAPIKey,))
def doctor_registration(request):
    context = {}
    password = request.data.get('password', None)
    password2 = request.data.get('password2', None)
    data = request.data.copy()
    data['role'] = User.DOCTOR
    userSerializer = RegistrationSerializers(data=data, context={"request":request})
    details = DoctorRegSerializer(data=request.data)

    # validations
    userSerializerValidation = userSerializer.is_valid(raise_exception=True)
    detailSerializerValidation = details.is_valid(raise_exception=True)
    PasswordErrors = dict() 
    try:
        password_validators.validate_password(password=userSerializer.initial_data['password'], user=User)
    except exceptions.ValidationError as e:
        PasswordErrors.update({'password' : list(e.messages)}) 
    if password != password2:
        PasswordErrors.update({'password': 'Passwords does not match.'})


    # save
    if userSerializerValidation and detailSerializerValidation and not PasswordErrors:
        user = userSerializer.save()
        details.save(user=user)
        context['otpId'] = user.id
        context['success'] = "Successfuly registered"
        subject = 'Account confirmation'
        html_content = render_to_string('Emails/Doctor/AccountConfirmation.html', {
            'title' : subject,
            "firstname" : user.firstname.capitalize()
        })
        text_content = strip_tags(html_content)
        email = EmailMultiAlternatives(subject, text_content, settings.EMAIL_HOST_USER, [user.email])
        email.attach_alternative(html_content, "text/html")
        # email.send()
        # whatsAppMessage = "Just reaching out to inform you that {drName} is waiting for his account verification to join shebirth family,kindly take appropriate actions.\nTo know more :{link}\nThis is a SYSTEM GENERATED MESSAGE".format(
        #     drName=user.firstname.capitalize() + " " + user.lastname,
        #     link="link"
        # )
        # admin_numbers = User.objects.filter(admin=True,mobile__isnull=False).values_list('mobile')
        # for number in admin_numbers:
        #     number = 'whatsapp:91{number}'.format(number=doctor.mobile)
        #     WhatsAppClient.messages.create(from_=from_number,body=whatsAppMessage,to=number)
        return JsonResponse(context, status=status.HTTP_201_CREATED)
    else:
        context = userSerializer.errors
        context.update(details.errors)
        context.update(PasswordErrors)
        return JsonResponse(context, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def sales_registration(request):
    context = {}
    password = request.data.get('password', None)
    password2 = request.data.get('password2', None)

    data = request.data.copy()
    data['role'] = User.SALES


    userSerializer = RegistrationSerializers(data=data, context={"request":request})
    details = SalesTeamSerializer(data=request.data)

    data['passwordString'] = request.data.get('password', None)
    details = SalesTeamSerializer(data=data)

    # validations
    userSerializerValidation = userSerializer.is_valid(raise_exception=True)
    detailSerializerValidation = details.is_valid(raise_exception=True)
    PasswordErrors = dict() 
    try:
        password_validators.validate_password(password=userSerializer.initial_data['password'], user=User)
    except exceptions.ValidationError as e:
        PasswordErrors.update({'password' : list(e.messages)})


    if userSerializerValidation and detailSerializerValidation and not PasswordErrors:
        user = userSerializer.save()
        detials = details.save(user=user)
        context['success'] = "successfuly registered"
        return JsonResponse(context, status=status.HTTP_201_CREATED)
    else:
        context = userSerializer.errors
        context.update(details.errors)
        context.update(PasswordErrors)
        return JsonResponse(context, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def consultant_registration(request):
    context = {}
    password = request.data.get('password', None)
    password2 = request.data.get('password2', None)

    data = request.data.copy()
    data['role'] = User.CONSULTANT

    userSerializer = RegistrationSerializers(data=data, context={"request":request})
    details = ConsultantInfoSerializer(data=request.data)

    data['passwordString'] = request.data.get('password', None)
    details = ConsultantInfoSerializer(data=data)

    # validations
    userSerializerValidation = userSerializer.is_valid(raise_exception=True)
    detailSerializerValidation = details.is_valid(raise_exception=True)
    PasswordErrors = dict() 
    try:
        password_validators.validate_password(password=userSerializer.initial_data['password'], user=User)
    except exceptions.ValidationError as e:
        PasswordErrors.update({'password' : list(e.messages)}) 

    if userSerializerValidation and detailSerializerValidation and not PasswordErrors:
        user = userSerializer.save()
        detials = details.save(user=user)
        context['success'] = "successfuly registered"
        return JsonResponse(context, status=status.HTTP_201_CREATED)
    else:
        context = userSerializer.errors
        context.update(details.errors)
        context.update(PasswordErrors)
        return JsonResponse(context, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def hostpital_registration(request):
    context = {}
    # password = request.data.get('password', None)
    # password2 = request.data.get('password2', None)

    data = request.data.copy()
    data['role'] = User.HOSPITAL_MANAGER
    data['passwordString'] = request.data.get('password', None)

    registration_serializer = RegistrationSerializers(data=data, context={"request":request})
    details = HospitalDetailSerializer(data=data)

    # validations
    userSerializerValidation = registration_serializer.is_valid(raise_exception=True)
    detailSerializerValidation = details.is_valid(raise_exception=True)

    PasswordErrors = dict() 
    try:
        password_validators.validate_password(password=registration_serializer.initial_data['password'], user=User)
    except exceptions.ValidationError as e:
        PasswordErrors.update({'password' : list(e.messages)}) 

    if userSerializerValidation and detailSerializerValidation and not PasswordErrors:
        user = registration_serializer.save()
        detials = details.save(user=user)
        context['success'] = "successfuly registered"
        return JsonResponse(context, status=status.HTTP_201_CREATED)
    else:
        context = registration_serializer.errors
        context.update(details.errors)
        context.update(PasswordErrors)
        return JsonResponse(context, status=status.HTTP_400_BAD_REQUEST)
from django.contrib.auth import authenticate, login as django_login


@api_view(['POST'])
# @permission_classes((HasAPIKey,))
@permission_classes((AllowAny,))
def login_view(request):
    data = request.data
    print(data)

    fcm_token_from_response = data.get('fcm_token')
    print("Extracted FCM token from response:", fcm_token_from_response)  # Log extracted FCM token

    # Check if the user is already authenticated
    if request.user.is_authenticated:
        print("User is already authenticated.")
        # Continue with the remaining logic
        serializer = LoginSerializer(data=data)
        # ... (existing code for the rest of the view)
        return

    username = data.get('email')
    password = data.get('password')
    user = authenticate(request, username=username, password=password)

    if user is not None:
        if not user.is_active:
            return JsonResponse(
                {
                    "error": "Please call your sales person to make this account activate."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        else:
            # Log the user in
            django_login(request, user)
            print("User is logged in successfully.")

            # Continue with the remaining logic
            serializer = LoginSerializer(data=data)
            # ... (existing code for the rest of the view)
    else:
        try:
            # Check if the user with the provided email exists
            user = User.objects.get(email=username)

            # Email is correct, but the account is not active
            if not user.is_active:
                return JsonResponse(
                    {
                        "Thank you for subscribing!": "We have received your payment and are excited to have you on board. Please allow us 24 hours to assign a dedicated account manager who will be available to assist you. Your account will be fully enabled once the account manager is assigned. We appreciate your patience and look forward to providing you with a seamless experience."
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Password is incorrect
            return JsonResponse(
                {
                    "error": "The provided password is incorrect."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        except User.DoesNotExist:
            # Email is incorrect
            return JsonResponse(
                {
                    "error": "The provided email is incorrect."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

    serializer = LoginSerializer(data=request.data)

    fcm_token = None
    data = request.data
    print(data)
    if data.get('fcm_token'):
        fcm_token = fcm_token

    if serializer.is_valid(raise_exception=True):
        user = serializer.validated_data['user']
        print(user.id)
        print(serializer.validated_data['fcm_token'])
        user_obj = User.objects.get(pk=user.id)
        if user_obj.fcm_token:
            # Delete the old FCM token
            user_obj.fcm_token = None
            user_obj.save()
            print("Old FCM token deleted.")

        fcm_token = data.get('fcm_token')  # Get the FCM token from request data
        if fcm_token:
            try:
                FirebaseFcm.objects.create(user=user_obj, fcm_token=serializer.validated_data['fcm_token'])
            except Exception as e:
                print(e)
        user_obj.fcm_token = fcm_token  # Update the fcm_token for the user
        user_obj.save()  # Save the user with updated fcm_token
        print("FCM token saved to user:", user_obj.fcm_token)  # Log saved FCM token

        # user_obj.fcm_token = serializer.validated_data['fcm_token']
        # print(user_obj)
    else:
        return JsonResponse(serializer.errors)

    token, created = Token.objects.get_or_create(user=user)

    user_obj.save()


    # Different users
    if user.role == User.CLIENT:
        try:
            print(user.id)
            Subscription = PurchasedMembership.objects.filter(user__id=user.id, is_paid=True).order_by('-pk')
            # if Subscription:
            has_subscription = True
            subscription_package = Subscription[0].membership.membership_name
        except Exception as e:
            has_subscription = False
            subscription_package = ""
        context = {
            'token': token.key,
            'client': True,
            'id': user.id,
            'has_subscription': has_subscription,
            'subscription_package': subscription_package,
            'fcm_token': fcm_token
        }

        return JsonResponse(context, status=status.HTTP_200_OK)
    elif user.role == User.DOCTOR:
        context = {
            'token': token.key,
            'doctor': True,
            'doctorId': user.id,
            'fcm_token': user_obj.fcm_token
        }
        return JsonResponse(context, status=status.HTTP_200_OK)
    elif user.role == User.SALES:
        return JsonResponse({
            "id": user.id,
            'token': token.key,
            'sales': True,
            'fcm_token': user_obj.fcm_token

        })
    elif user.role == User.ADMIN:
        return JsonResponse({
            "id": user.id,
            'token': token.key,
            'admin': True,
            'fcm_token': user_obj.fcm_token

        })
    elif user.role == User.CONSULTANT:
        return JsonResponse({
            "id": user.id,
            'token': token.key,
            "consltant": True,
            'fcm_token': user_obj.fcm_token

        })

    elif user.role == User.DAD:
        return JsonResponse({
            "id": user.id,
            'token': token.key,
            "dad": True,
            'fcm_token': user_obj.fcm_token

        })
    else:  # user.hospitalManager
        return JsonResponse({
            "id": user.id,
            'token': token.key,
            "hospitalManager": True,
            'fcm_token': user_obj.fcm_token

        })