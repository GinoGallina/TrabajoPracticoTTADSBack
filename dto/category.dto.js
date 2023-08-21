import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import addErrors from 'ajv-errors'
import CategoryDTOSchema from '../lib/categoryDTO-types.js' // Ruta correcta a tu DTO de categoría

const ajv = new Ajv({ allErrors: true })
addFormats(ajv, ['uuid']).addKeyword('kind').addKeyword('modifier')
addErrors(ajv)

const validateSchema = ajv.compile(CategoryDTOSchema)

const validateCategoryDTO = (req, res, next) => {
  const isDTOValid = validateSchema(req.body)
  if (!isDTOValid) {
    return res.status(400).send({ errors: validateSchema.errors.map(err => err.message) })
  }

  next()
}

export default validateCategoryDTO
