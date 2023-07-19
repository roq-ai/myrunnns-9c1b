import * as yup from 'yup';

export const participationValidationSchema = yup.object().shape({
  progress: yup.number().integer(),
  guest_id: yup.string().nullable(),
  event_id: yup.string().nullable(),
});
