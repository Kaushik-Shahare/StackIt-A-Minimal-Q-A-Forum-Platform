from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email,  password=None, user_type=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email).lower()
        user_type_instance = UserType.objects.get(name=user_type) if user_type else None
        user = self.model(email=email, user_type=user_type_instance, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_new_user(self, email,  password=None, user_type=None, verified=True, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email).lower()
        user_type_instance = UserType.objects.get(name=user_type) if user_type else None
        
        user = self.model(email=email, user_type=user_type_instance, verified=True, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        email = self.normalize_email(email).lower()
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


AUTH_PROVIDERS = {'email': 'email',
                #   'facebook': 'facebook',
                  'google': 'google'}

class Permission(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.name


class UserType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    permissions = models.ManyToManyField(Permission, related_name='user_types', blank=True)

    def __str__(self):
        return self.name

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255,unique=True, db_index=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    user_type = models.ForeignKey(UserType, on_delete=models.SET_NULL, null=True, blank=True)
    user_stage = models.IntegerField(default=0)  # 0: registered, 1: profile incomplete, 2: profile complete
    verified = models.BooleanField(default=False)
    steps = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    auth_provider = models.CharField(
        max_length=255, blank=False,
        null=False, default=AUTH_PROVIDERS.get('email'))
    # Remove unused fields if any
    # Add more fields if needed for hospital management
    objects = UserManager() 
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    def save(self, *args, **kwargs):
        self.email = self.email.lower()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.email
    
genders = [
    ("Male", "Male"),
    ("Female", "Female"),
    ("Other", "Other"),
    ("Prefer not to say", "Prefer not to say"),
]

class Address(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='addresses')
    street = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    is_primary = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.street}, {self.city}, {self.state}, {self.country}"
        
    def save(self, *args, **kwargs):
        # If this is marked as primary, unmark other addresses for this user
        if self.is_primary:
            Address.objects.filter(user=self.user, is_primary=True).exclude(id=self.id).update(is_primary=False)
        super().save(*args, **kwargs)

class UserProfile(models.Model):
    """Unified profile for all user types (Doctor, Patient, Nurse, Admin)."""
    user = models.OneToOneField('User', on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=genders, default="Prefer not to say")
    
    def __str__(self):
        return f"{self.user.email} Profile"

