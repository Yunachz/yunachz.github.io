import { loadV3Content, validateV3Content } from './v3-content-validation.mjs';

const counts = validateV3Content(await loadV3Content());
console.log(
  'V3 content valid: ' +
  counts.projects + ' projects, ' +
  counts.skills + ' skills, ' +
  counts.software + ' software apps, ' +
  counts.experience + ' experiences, ' +
  counts.education + ' education entries, ' +
  counts.credentials + ' certificates.'
);
