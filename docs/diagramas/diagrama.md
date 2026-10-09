# Diagrama de Clases

## Modelo de Datos

```mermaid
classDiagram
    direction TB

    %% ──────────────────────────────────────────────
    %% ENUMERACIONES
    %% ──────────────────────────────────────────────
    class Rol {
        <<enumeration>>
        ADMIN
        MEDICO
        PACIENTE
    }

    class EstadoTurno {
        <<enumeration>>
        CONFIRMADO
        CANCELADO
        REPROGRAMADO
        AUSENTE
        ATENDIDO
    }

    class AccionHistorialTurno {
        <<enumeration>>
        ALTA
        CANCELACION
        REPROGRAMACION
        CAMBIO_ESTADO
        MODIFICACION
    }

    class AccionAuditoria {
        <<enumeration>>
        ALTA
        MODIFICACION
        BAJA_LOGICA
        ASIGNACION
        DESASIGNACION
    }

    %% ──────────────────────────────────────────────
    %% ENTIDADES DEL DOMINIO
    %% ──────────────────────────────────────────────
    class Usuario {
        +Int id
        +String email
        +String password
        +Rol rol
        +Boolean activo
        +DateTime creadoEn
    }

    class Paciente {
        +Int id
        +Int usuarioId
        +String nombre
        +String apellido
        +String dni
        +String? telefono
        +Int? coberturaId
        +String? nroAfiliado
    }

    class Medico {
        +Int id
        +Int usuarioId
        +String nombre
        +String apellido
        +String matricula
        +Int especialidadId
    }

    class Consultorio {
        +Int id
        +String codigo
        +String nombre
        +String? ubicacion
        +Boolean activo
        +DateTime creadoEn
    }

    class MedicoConsultorio {
        +Int medicoId
        +Int consultorioId
        +Boolean activo
        +DateTime asignadoEn
    }

    class Especialidad {
        +Int id
        +String nombre
        +String? descripcion
    }

    class Cobertura {
        +Int id
        +String nombre
    }

    class MedicoCobertura {
        +Int medicoId
        +Int coberturaId
        +Decimal? arancelCopago
    }

    class HorarioAtencion {
        +Int id
        +Int medicoId
        +Int diaSemana
        +Int horaDesdeMinutos
        +Int horaHastaMinutos
        +Int duracionTurnoMinutos
    }

    class BloqueoAgenda {
        +Int id
        +Int medicoId
        +DateTime fechaDesde
        +DateTime fechaHasta
        +String? motivo
        +DateTime creadoEn
    }

    class Turno {
        +Int id
        +Int pacienteId
        +Int medicoId
        +Int consultorioId
        +Int? coberturaId
        +DateTime fecha
        +Int horaInicioMinutos
        +Int horaFinMinutos
        +EstadoTurno estado
        +String? motivoConsulta
        +DateTime creadoEn
        +Int? turnoAnteriorId
    }

    class HistorialTurno {
        +Int id
        +Int turnoId
        +Int? actorUsuarioId
        +AccionHistorialTurno accion
        +EstadoTurno? estadoAnterior
        +EstadoTurno? estadoNuevo
        +Json? valoresAnteriores
        +Json? valoresNuevos
        +String? origen
        +String? motivo
        +DateTime creadoEn
    }

    class AuditoriaOperacion {
        +Int id
        +Int? actorUsuarioId
        +String entidad
        +String entidadId
        +AccionAuditoria accion
        +Json? valoresAnteriores
        +Json? valoresNuevos
        +String? origen
        +String? motivo
        +DateTime creadoEn
    }

    %% ──────────────────────────────────────────────
    %% RELACIONES ENTRE ENTIDADES
    %% ──────────────────────────────────────────────
    Usuario "1" -- "0..1" Paciente : tiene
    Usuario "1" -- "0..1" Medico : tiene
    Usuario "0..1" -- "0..*" HistorialTurno : registra
    Usuario "0..1" -- "0..*" AuditoriaOperacion : ejecuta
    Usuario ..> Rol : usa

    Paciente "0..*" --> "0..1" Cobertura : pertenece a
    Paciente "1" -- "0..*" Turno : reserva

    Medico "0..*" --> "1" Especialidad : ejerce
    Medico "1" -- "0..*" HorarioAtencion : configura
    Medico "1" -- "0..*" BloqueoAgenda : registra
    Medico "1" -- "0..*" Turno : atiende
    Medico "1" -- "0..*" MedicoCobertura : acepta
    Medico "1" -- "0..*" MedicoConsultorio : asignado
    Consultorio "1" -- "0..*" MedicoConsultorio : disponible para
    Consultorio "1" -- "0..*" Turno : aloja

    Cobertura "1" -- "0..*" MedicoCobertura : vinculada a
    Cobertura "1" -- "0..*" Turno : cubre

    MedicoCobertura --> Medico : medicoId
    MedicoCobertura --> Cobertura : coberturaId

    Turno ..> EstadoTurno : usa
    Turno --> Paciente : pacienteId
    Turno --> Medico : medicoId
    Turno --> Consultorio : consultorioId
    Turno --> Cobertura : coberturaId
    Turno "0..1" --> "0..1" Turno : reprograma
    Turno "1" -- "0..*" HistorialTurno : conserva eventos
    Turno ..> AccionHistorialTurno : registra acciones
    AuditoriaOperacion ..> AccionAuditoria : registra acciones
```