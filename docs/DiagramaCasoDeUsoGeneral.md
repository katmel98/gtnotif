```mermaid
sequenceDiagram
Plataforma Externa->>GTNotif: Envía información de autenticación
Note right of Plataforma Externa: TokenID de la plataforma externa
GTNotif->>Módulo de Envío: Solicita Verificación TokenID
Módulo de Envío-->>BBDD: Verifica TokenID
BBDD-->>BBDD: Consulta existencia de TokenID 
BBDD-->>Módulo de Envío: Validación de existencia de TokenID
Módulo de Envío->>GTNotif: Genera SessionToken
GTNotif->>Plataforma Externa: SessionToken
Plataforma Externa->>GTNotif: Paquete de Datos para envío
Note right of Plataforma Externa: origen, destino(s), tema, texto del mensaje, uuid del mensaje, SessionToken
GTNotif->>GTNotif: Valida Conexión SessionToken
GTNotif->>Módulo de Envío: Datos para el envío
Módulo de Envío->>BBDD: Registra Datos
Módulo de Envío->>Origen: Envía copia del mensaje
Módulo de Envío->>Destinatarios: Envío Mensaje
alt si Envío Correcto
    Módulo de Envío->>GTNotif: Mensaje Envío OK
else si Envío Incorrecto
Módulo de Envío->>GTNotif: Mensaje Envío KO
end
GTNotif->>Plataforma Externa: Mensaje Respuesta