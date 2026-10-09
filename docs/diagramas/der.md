# Diagrama Entidad-Relación (DER)

## Modelo relacional objetivo


```mermaid
erDiagram
    USUARIOS {
        int id PK
        varchar email UK
        varchar password
        enum rol
        boolean activo
        datetime creado_en
    }

    PACIENTES {
        int id PK
        int usuario_id FK, UK
        varchar nombre
        varchar apellido
        varchar dni UK
        varchar telefono
        int cobertura_id FK
        varchar nro_afiliado
    }

    MEDICOS {
        int id PK
        int usuario_id FK, UK
        varchar nombre
        varchar apellido
        varchar matricula UK
        int especialidad_id FK
    }

    ESPECIALIDADES {
        int id PK
        varchar nombre UK
        text descripcion
    }

    CONSULTORIOS {
        int id PK
        varchar codigo UK
        varchar nombre
        varchar ubicacion
        boolean activo
        datetime creado_en
    }

    MEDICOS_CONSULTORIOS {
        int medico_id PK, FK
        int consultorio_id PK, FK
        boolean activo
        datetime asignado_en
    }

    COBERTURAS {
        int id PK
        varchar nombre UK
    }

    MEDICOS_COBERTURAS {
        int medico_id PK, FK
        int cobertura_id PK, FK
        decimal arancel_copago
    }

    HORARIOS_ATENCION {
        int id PK
        int medico_id FK
        int dia_semana
        int hora_desde_minutos
        int hora_hasta_minutos
        int duracion_turno_minutos
    }

    BLOQUEOS_AGENDA {
        int id PK
        int medico_id FK
        datetime fecha_desde
        datetime fecha_hasta
        varchar motivo
        datetime creado_en
    }

    TURNOS {
        int id PK
        int paciente_id FK
        int medico_id FK
        int consultorio_id FK
        int cobertura_id FK
        date fecha
        int hora_inicio_minutos
        int hora_fin_minutos
        enum estado
        varchar motivo_consulta
        datetime creado_en
        int turno_anterior_id FK, UK
    }

    HISTORIAL_TURNOS {
        int id PK
        int turno_id FK
        int actor_usuario_id FK
        enum accion
        enum estado_anterior
        enum estado_nuevo
        json valores_anteriores
        json valores_nuevos
        varchar origen
        varchar motivo
        datetime creado_en
    }

    AUDITORIA_OPERACIONES {
        int id PK
        int actor_usuario_id FK
        varchar entidad
        varchar entidad_id
        enum accion
        json valores_anteriores
        json valores_nuevos
        varchar origen
        varchar motivo
        datetime creado_en
    }

    USUARIOS ||--o| PACIENTES : tiene_perfil
    USUARIOS ||--o| MEDICOS : tiene_perfil
    COBERTURAS o|--o{ PACIENTES : cobertura_preferida
    ESPECIALIDADES ||--o{ MEDICOS : clasifica

    MEDICOS ||--o{ MEDICOS_CONSULTORIOS : tiene_asignaciones
    CONSULTORIOS ||--o{ MEDICOS_CONSULTORIOS : recibe_asignaciones
    MEDICOS ||--o{ MEDICOS_COBERTURAS : acepta
    COBERTURAS ||--o{ MEDICOS_COBERTURAS : es_aceptada

    MEDICOS ||--o{ HORARIOS_ATENCION : define
    MEDICOS ||--o{ BLOQUEOS_AGENDA : registra

    PACIENTES ||--o{ TURNOS : reserva
    MEDICOS ||--o{ TURNOS : atiende
    CONSULTORIOS ||--o{ TURNOS : aloja
    COBERTURAS o|--o{ TURNOS : cubre
    TURNOS o|--o| TURNOS : reprogramacion

    TURNOS ||--o{ HISTORIAL_TURNOS : conserva_eventos
    USUARIOS o|--o{ HISTORIAL_TURNOS : actua_en
    USUARIOS o|--o{ AUDITORIA_OPERACIONES : ejecuta
```

## Restricciones de integridad

- `MEDICOS_CONSULTORIOS` y `MEDICOS_COBERTURAS` tienen clave primaria compuesta por sus dos claves foráneas.
- `TURNOS.turno_anterior_id` es opcional y único: un turno puede tener como máximo un sucesor directo por reprogramación.
- `AUDITORIA_OPERACIONES.entidad` y `entidad_id` forman una referencia polimórfica y no una clave foránea SQL. La aplicación debe validar la entidad afectada.
- Un turno `CONFIRMADO` no puede solaparse temporalmente con otro turno confirmado del mismo médico ni del mismo consultorio. La integridad requiere validación transaccional y bloqueo de recursos; un índice por hora de inicio no cubre por sí solo intervalos de distinta duración.
- `CANCELADO` y `REPROGRAMADO` conservan su fila histórica, pero no ocupan disponibilidad futura.
- Los actores de historial/auditoría son opcionales para conservar los eventos aunque una cuenta relacionada deje de existir; cuando existe el usuario, la clave foránea se mantiene.
