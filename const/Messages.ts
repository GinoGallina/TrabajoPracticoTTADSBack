export class Messages {
	static Error = class {
		static Exception(): string {
			return "Ha ocurrido un error inesperado. Por favor, intenta de nuevo.";
		}
		static Unauthorized(): string {
			return "No tienes permisos para realizar esta operación.";
		}
		static EntityNotFound(entityName: string, femine = false): string {
			return `${entityName} no encontrad${femine ? "a" : "o"}.`;
		}
		static EntitiesNotFound(entitiesName: string, femine = false): string {
			return `Algun${femine ? "a" : "o"} de l${femine ? "a" : "o"}s ${entitiesName} no pudo ser encontrad${femine ? "a" : "o"}.`;
		}
		static SaveEntity(entityName: string): string {
			return `Ha ocurrido un error al intentar guardar ${entityName}. Por favor, intenta de nuevo.`;
		}
		static FieldsRequired(fields?: string[]): string {
			return fields?.length
				? `Debes ingresar todos los campos obligatorios: ${fields.join(", ")}.`
				: "Debes ingresar todos los campos obligatorios.";
		}
		static FieldRequired(fieldName: string): string {
			return `El campo ${fieldName} es requerido.`;
		}
		static FieldGreaterThanZero(fieldName: string): string {
			return `El campo ${fieldName} debe ser mayor a cero.`;
		}
		static InvalidField(fieldName: string): string {
			return `El campo ${fieldName} no es válido.`;
		}
		static UniqueField(fieldName: string): string {
			return `El campo ${fieldName} debe ser único.`;
		}
		static DuplicateEntity(entity: string, femine = false): string {
			return `Ya existe un${femine ? "a" : ""} ${entity} con los datos ingresados.`;
		}
		static InvalidEmail(): string {
			return "El email ingresado no es válido.";
		}
		static InvalidLogin(): string {
			return "Email y/o contraseña inválidos.";
		}
		static InvalidToken(): string {
			return "El token ingresado no es válido. Por favor, inicia sesión nuevamente.";
		}
	};

	static CRUD = class {
		static EntityCreated(entityName: string, femine = false): string {
			return `${entityName} cread${femine ? "a" : "o"} correctamente.`;
		}
		static EntityUpdated(entityName: string, femine = false): string {
			return `${entityName} editad${femine ? "a" : "o"} correctamente.`;
		}
		static EntityDeleted(entityName: string, femine = false): string {
			return `${entityName} eliminad${femine ? "a" : "o"} correctamente.`;
		}
	};
}
