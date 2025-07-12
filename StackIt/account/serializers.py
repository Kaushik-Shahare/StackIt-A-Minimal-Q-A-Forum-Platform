from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from .models import UserProfile, Address

User = get_user_model()

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'street', 'area', 'city', 'state', 'pincode', 'country', 'is_primary']
        read_only_fields = ['user']
        extra_kwargs = {
            'street': {'required': False},
            'area': {'required': False},
            'city': {'required': False},
            'state': {'required': False}, 
            'pincode': {'required': False},
            'country': {'required': False},
            'is_primary': {'required': False},
        }
        
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
    patient_id = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    address = AddressSerializer(required=False, write_only=True)
    location = serializers.CharField(required=False)
    
    # Read-only fields for nested data (separate from write fields)
    address_data = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = UserProfile
        fields = [
            'patient_id', 'name', 'gender', 'date_of_birth', 'age', 'email',
            'phone_number', 'location', 'address_data', 'user_type',
            'address'
        ]
        extra_kwargs = {
            'name': {'required': False},
            'phone_number': {'required': False},
            'date_of_birth': {'required': False},
            'gender': {'required': False},
        }
    
    def get_patient_id(self, obj):
        try:
            return obj.user.id
        except:
            return None
    
    def get_email(self, obj):
        try:
            return obj.user.email
        except:
            return None
    
    def get_user_type(self, obj):
        try:
            return obj.user.user_type.name if obj.user.user_type else None
        except:
            return None
    
    def get_age(self, obj):
        try:
            if not obj.date_of_birth:
                return None
                
            from datetime import date
            today = date.today()
            born = obj.date_of_birth
            age = today.year - born.year - ((today.month, today.day) < (born.month, born.day))
            return age
        except:
            return None

    def get_address_data(self, obj):
        try:
            address = obj.user.addresses.filter(is_primary=True).first()
            if address:
                return {
                    "id": address.id,
                    "street": address.street or "",
                    "area": address.area or "",
                    "city": address.city or "",
                    "state": address.state or "",
                    "pincode": address.pincode or "",
                    "country": address.country or "",
                    "is_primary": address.is_primary
                }
            return None
        except:
            return None
        
    def validate(self, attrs):
        """
        Custom validation to handle nested data and prevent errors
        """
        # Make sure none of these fields cause validation errors
        if 'address' in attrs:
            # Ensure all fields in address are strings
            for field in ['street', 'area', 'city', 'state', 'pincode', 'country']:
                if field in attrs['address'] and attrs['address'][field] is None:
                    attrs['address'][field] = ''
        
        return attrs
    
    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)
        
        # Update UserProfile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update or create Address
        if address_data:
            user = instance.user
            Address.objects.update_or_create(
                user=user,
                is_primary=True,
                defaults=address_data
            )
        
        # Return the updated instance
        return instance
        
    def to_representation(self, instance):
        """Customize the output representation for better clarity"""
        ret = super().to_representation(instance)
        
        # Remove write-only fields from output
        for field in ['address']:
            if field in ret:
                ret.pop(field)
                
        # Rename the _data fields back to their original names
        if 'address_data' in ret:
            ret['address'] = ret.pop('address_data')
            
        return ret

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    user_type = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'user_type')

    def create(self, validated_data):
        user_type = validated_data.pop('user_type', 'User')
        user = User.objects.create_user(user_type=user_type, **validated_data)
        user.user_stage = 1  # After registration, stage is 1 (profile incomplete)
        user.save()
        # UserProfile will be created by the signal
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError('Invalid credentials')

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class UserDetailSerializer(serializers.ModelSerializer):
    user_type = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'user_type', 'user_stage', 'profile'
        ]
        
    def get_user_type(self, obj):
        return obj.user_type.name if obj.user_type else None
        
    def get_profile(self, obj):
        # Return the patient data format
        try:
            return UserProfileSerializer(obj.profile).data
        except:
            return None
