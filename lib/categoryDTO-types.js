import { Type } from '@sinclair/typebox';

const CategoryDTOSchema  = Type.Object({
  category: Type.String({
      minLength:2,
      errorMessage:{
        minLength:'Longitud minima es 2',
      }
    }),
},
  {
    additionalProperties:false,
    errorMessage:{
      additionalProperties:"El formato del body no es válido"
    }
  });


export default CategoryDTOSchema ;