from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.db import models

# Create your models here.


class UserAccountManager(BaseUserManager):
    def create_user(self, cedula, email, password, nombre, rol=None, apellidos=None, fechaNacimiento=None, telefono=None):
        email = self.normalize_email(email)
        email = email.lower()
        user = self.model(
            cedula=cedula,
            rol=rol,
            nombre=nombre,
            apellidos=apellidos,
            fechaNacimiento=fechaNacimiento,
            telefono=telefono,
            email=email,
            password=password,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def update_password(self, cedula, new_password):
        user = self.get(cedula=cedula)
        user.set_password(new_password)
        user.save(using=self._db)

    def create_superuser(self, cedula, email, password, nombre, rol=None, apellidos=None, fechaNacimiento=None, telefono=None, estado=None):
        user = self.create_user(
            cedula=cedula,
            rol=rol,
            nombre=nombre,
            apellidos=apellidos,
            fechaNacimiento=fechaNacimiento,
            telefono=telefono,
            email=email,
            password=password,
        )
        user.is_staff = True
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class Usuario(AbstractBaseUser, PermissionsMixin):
    cedula = models.PositiveIntegerField(primary_key=True, unique=True)
    rolOpciones = [("Cliente", "Cliente"), ("Administrador", "Administrador"),
                   ("Gerente", "Gerente"), ("Operador", "Operador")]
    rol = models.CharField(choices=rolOpciones,
                           default='Cliente', max_length=16)
    nombre = models.CharField(max_length=64)
    apellidos = models.CharField(max_length=64, default='apellido')
    fechaNacimiento = models.DateField()
    telefono = models.CharField(max_length=16)
    email = models.EmailField(unique=True)
    estadoOpciones = [("Activo", "Activo"), ("Inactivo", "Inactivo")]
    estado = models.CharField(choices=estadoOpciones,
                              default='Activo', max_length=16)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    objects = UserAccountManager()

    USERNAME_FIELD = 'cedula'
    REQUIRED_FIELDS = ['email', 'nombre', 'rol',
                       'apellidos', 'fechaNacimiento', 'telefono']

    def __str__(self):
        return str(self.cedula)


class Subsidio(models.Model):
    estrato = models.IntegerField(primary_key=True, default=0)
    porcentaje = models.DecimalField(decimal_places=5, max_digits=6)


class Cliente(models.Model):
    cedula = models.OneToOneField(Usuario, on_delete=models.CASCADE,
                                  related_name="clientInfo", null=False, blank=False, primary_key=True)
    suspendido = models.BooleanField(default=False)
    direccion = models.CharField(max_length=264)
    estrato = models.ForeignKey(Subsidio,  on_delete=models.CASCADE)


class Facturacion(models.Model):

    fechaPago = models.DateField()
    consumo = models.IntegerField()
    cedula = models.ForeignKey(
        Cliente,  on_delete=models.CASCADE, related_name="invoices")
    estadoPagoOpciones = [("Sin pagar", "Sin pagar"),
                          ("Pagado", "Pagado"), ("En mora", "En mora")]
    estadoPago = models.CharField(
        choices=estadoPagoOpciones, default='Sin pagar', max_length=16)

    class Meta:
        ordering = ['fechaPago']


class Factura(models.Model):
    porcentajeMora = models.DecimalField(
        default=0.02, max_digits=6, decimal_places=5)
    valorUnitario = models.IntegerField(default=803)


class Pago(models.Model):
    monto = models.DecimalField(decimal_places=5, max_digits=15)
    numeroFactura = models.OneToOneField(
        Facturacion, on_delete=models.CASCADE, null=False, blank=False, primary_key=True)
    fecha = models.DateField(auto_now_add=True)
