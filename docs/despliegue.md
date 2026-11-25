# Evidencia de Despliegue en AWS — EventoYa

* **Región:** `us-east-2` (Ohio)
* **VPC:** `vpc-06ea9353728e3ce86` (`eventoya-vpc`, CIDR `10.0.0.0/16`) con subred pública `subnet-0c6595ae41c76dcfe` y subred privada aislada
* **Security Group:** `eventoya-proxy-sg` (`sg-0a054028a213df9fb`) con puertos `80/TCP` (`0.0.0.0/0`) y `22/TCP` (IP administrador)
* **Instancia EC2:** `i-07a99977e7305dfc3` (`eventoya-server`, Ubuntu Server 24.04 LTS, `t3.micro`, 10 GiB `gp3`, IP privada `10.0.3.70`) con instalación automatizada de Docker mediante *User Data*
* **Limpieza de recursos:** Instancia EC2 terminada y VPC de prueba eliminada al finalizar la práctica para preservar los créditos de AWS