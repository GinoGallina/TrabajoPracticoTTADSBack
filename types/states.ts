import { z } from 'zod'

const StateSchema = z.enum(['Active', 'Archived'])
.refine(value=>['Active','Archived'].includes(value),{ 
  message: 'State must be valid'
}).default('Active');

export default StateSchema