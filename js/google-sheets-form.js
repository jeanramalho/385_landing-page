const GOOGLE_SHEETS_FORM_CONFIG = {
  endpoint: 'COLE_AQUI_A_URL_DO_WEB_APP_DO_GOOGLE_APPS_SCRIPT',
  formSelector: '[data-google-sheets-form]',
  successSelector: '#formSuccess',
  sheetName: 'Leads',
  submitButtonText: {
    idle: 'Enviar pedido de orçamento',
    loading: 'Enviando...',
  },
};

function buildGoogleSheetsPayload(form) {
  const formData = new FormData(form);
  const payload = new URLSearchParams();

  formData.forEach((value, key) => {
    payload.append(key, String(value).trim());
  });

  payload.append('sheet_name', GOOGLE_SHEETS_FORM_CONFIG.sheetName);
  payload.append('pagina_origem', window.location.href);
  payload.append('data_envio_cliente', new Date().toISOString());

  return payload;
}

function isGoogleSheetsEndpointConfigured() {
  const { endpoint } = GOOGLE_SHEETS_FORM_CONFIG;

  return endpoint && !endpoint.includes('COLE_AQUI');
}

function setFormLoadingState(form, isLoading) {
  const submitButton = form.querySelector('[type="submit"]');

  if (!submitButton) {
    return;
  }

  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading
    ? GOOGLE_SHEETS_FORM_CONFIG.submitButtonText.loading
    : GOOGLE_SHEETS_FORM_CONFIG.submitButtonText.idle;
}

function showSuccessMessage(form) {
  const successMessage = document.querySelector(GOOGLE_SHEETS_FORM_CONFIG.successSelector);

  form.style.display = 'none';

  if (successMessage) {
    successMessage.classList.add('active');
  }
}

function showSubmitError(error) {
  console.error('Erro ao enviar formulario para o Google Sheets:', error);
  alert('Nao foi possivel enviar agora. Confira a conexao e tente novamente.');
}

async function submitFormToGoogleSheets(form) {
  if (!isGoogleSheetsEndpointConfigured()) {
    throw new Error('Configure a URL do Web App em js/google-sheets-form.js');
  }

  await fetch(GOOGLE_SHEETS_FORM_CONFIG.endpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: buildGoogleSheetsPayload(form).toString(),
  });
}

function handleGoogleSheetsFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;

  setFormLoadingState(form, true);

  submitFormToGoogleSheets(form)
    .then(() => {
      form.reset();
      showSuccessMessage(form);
    })
    .catch(showSubmitError)
    .finally(() => {
      setFormLoadingState(form, false);
    });
}

function initGoogleSheetsForm() {
  const form = document.querySelector(GOOGLE_SHEETS_FORM_CONFIG.formSelector);

  if (!form) {
    return;
  }

  form.addEventListener('submit', handleGoogleSheetsFormSubmit);
}

initGoogleSheetsForm();
