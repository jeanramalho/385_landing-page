const SPREADSHEET_ID = 'COLE_AQUI_O_ID_DA_SUA_PLANILHA';
const DEFAULT_SHEET_NAME = 'Leads';

const COLUMNS = [
  'Recebido em',
  'Nome completo',
  'Telefone / WhatsApp',
  'Cidade e local',
  'Data do evento',
  'Tipo de estrutura',
  'Mensagem adicional',
  'Pagina de origem',
  'Data enviada pelo navegador',
];

function doPost(event) {
  try {
    const params = event.parameter || {};
    const sheet = getTargetSheet(params.sheet_name);

    ensureHeader(sheet);

    sheet.appendRow([
      new Date(),
      params.nome_completo || '',
      params.telefone_whatsapp || '',
      params.cidade_local || '',
      params.data_evento || '',
      params.tipo_estrutura || '',
      params.mensagem_adicional || '',
      params.pagina_origem || '',
      params.data_envio_cliente || '',
    ]);

    return jsonResponse({
      ok: true,
      message: 'Lead salvo com sucesso.',
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      message: error.message,
    });
  }
}

function doGet() {
  return jsonResponse({
    ok: true,
    message: 'Web App ativo. Envie os dados usando POST.',
  });
}

function getTargetSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const normalizedSheetName = sheetName || DEFAULT_SHEET_NAME;

  return spreadsheet.getSheetByName(normalizedSheetName)
    || spreadsheet.insertSheet(normalizedSheetName);
}

function ensureHeader(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, COLUMNS.length).getValues()[0];
  const hasHeader = firstRow.some(function (cell) {
    return cell !== '';
  });

  if (hasHeader) {
    return;
  }

  sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
  sheet.setFrozenRows(1);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
