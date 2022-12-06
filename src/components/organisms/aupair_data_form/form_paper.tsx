import { makeStyles } from '@material-ui/styles'
import {
  Box,
  Button,
  Paper,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { theme } from '../../../styles'
import EditAupairForm1 from './form1'
import EditAupairForm2 from './form2'
import EditAupairForm3 from './form3'
import EditAupairForm4 from './form4'

const useStyles = makeStyles({
  paper: {
    [theme.breakpoints.up('lg')]: {
      width: '900px',
      minHeight: '720px',
    },
    [theme.breakpoints.down('lg')]: {
      width: '600px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '350px',
    },
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 8,
    textAlign: 'center',
    padding: 40,
    mt: 20,
  },
  buttons: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 24,
  },
})

type Object = { [key: string]: any }

interface Props {
  submitLabel: string
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handlePrevious: () => void
  activeStep: number
  form: Object
  setForm: Dispatch<SetStateAction<any>>
}

const AupairFormPaper: React.FC<Props> = ({
  submitLabel,
  handleSubmit,
  handlePrevious,
  activeStep,
  form,
  setForm,
}) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const handleOnChange = (
    event:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | SelectChangeEvent<any>
  ) => {
    const { name, value } = event.target

    setForm((oldForm: Object) => ({ ...oldForm, [name]: value }))
  }

  const formToRender = () => {
    const props = {
      form: form,
      handleOnChange: handleOnChange,
      setForm: setForm,
    }

    switch (activeStep) {
      case 0:
        return <EditAupairForm1 {...props} />
      case 1:
        return <EditAupairForm2 {...props} />
      case 2:
        return <EditAupairForm3 {...props} />
      case 3:
        return <EditAupairForm4 {...props} />
      default:
        return <EditAupairForm1 {...props} />
    }
  }

  return (
    <Paper className={classes.paper} component="form" onSubmit={handleSubmit}>
      {activeStep === 0 && (
        <Box>
          <Typography variant="h3">Se candidate a vagas</Typography>
          <Typography variant="body2" color="#6C757D">
            Preencha o formulário com as informações necessárias.
          </Typography>
        </Box>
      )}

      {formToRender()}

      <Box className={classes.buttons}>
        {activeStep !== 0 && (
          <Button color="secondary" variant="outlined" onClick={handlePrevious}>
            {t('organisms.job_form.form_paper.back_button')}
          </Button>
        )}

        <Button color="primary" variant="contained" type="submit">
          {submitLabel}
        </Button>
      </Box>
    </Paper>
  )
}

export default AupairFormPaper