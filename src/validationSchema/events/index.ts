import * as yup from 'yup';

export const eventValidationSchema = yup.object().shape({
  name: yup.string().required(),
  location: yup.string().required(),
  date: yup.date().required(),
  company_id: yup.string().nullable(),
});
