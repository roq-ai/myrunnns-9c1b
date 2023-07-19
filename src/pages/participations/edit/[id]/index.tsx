import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getParticipationById, updateParticipationById } from 'apiSdk/participations';
import { Error } from 'components/error';
import { participationValidationSchema } from 'validationSchema/participations';
import { ParticipationInterface } from 'interfaces/participation';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { GuestInterface } from 'interfaces/guest';
import { EventInterface } from 'interfaces/event';
import { getGuests } from 'apiSdk/guests';
import { getEvents } from 'apiSdk/events';

function ParticipationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ParticipationInterface>(
    () => (id ? `/participations/${id}` : null),
    () => getParticipationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ParticipationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateParticipationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/participations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ParticipationInterface>({
    initialValues: data,
    validationSchema: participationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Participation
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="progress" mb="4" isInvalid={!!formik.errors?.progress}>
              <FormLabel>Progress</FormLabel>
              <NumberInput
                name="progress"
                value={formik.values?.progress}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('progress', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.progress && <FormErrorMessage>{formik.errors?.progress}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<GuestInterface>
              formik={formik}
              name={'guest_id'}
              label={'Select Guest'}
              placeholder={'Select Guest'}
              fetcher={getGuests}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<EventInterface>
              formik={formik}
              name={'event_id'}
              label={'Select Event'}
              placeholder={'Select Event'}
              fetcher={getEvents}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'participation',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ParticipationEditPage);
