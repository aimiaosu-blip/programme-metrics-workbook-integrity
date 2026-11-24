/** @OnlyCurrentDoc */
/** Independent synthetic demonstration. Run only on a copy of the demo workbook. */
const REQUIRED = ['project_id','region','requested_usd','approved_usd','disbursed_usd','participants'];

function validateRows(grid) {
  const headers = grid[0];
  if (new Set(headers).size !== headers.length) throw new Error('Duplicate headers');
  REQUIRED.forEach(h => {if (!headers.includes(h)) throw new Error('Missing header: '+h);});
  const seen = new Set();
  grid.slice(1).filter(r=>r.some(v=>v!=='' && v!==null)).forEach((r,i)=>{
    const value = h=>r[headers.indexOf(h)];
    if (!value('project_id') || seen.has(value('project_id'))) throw new Error('Missing/duplicate project ID at row '+(i+2));
    seen.add(value('project_id'));
    if (!value('region')) throw new Error('Missing region');
    REQUIRED.slice(2).forEach(h=>{if(typeof value(h)!=='number'||!Number.isFinite(value(h))||value(h)<0) throw new Error('Invalid '+h);});
    if (!Number.isInteger(value('participants'))) throw new Error('Participants must be an integer');
    if(value('disbursed_usd')>value('approved_usd')||value('approved_usd')>value('requested_usd')) throw new Error('Funding hierarchy violation');
  });
  return true;
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Metrics integrity').addItem('Validate data and reconcile','runIntegrityAudit').addItem('Inventory formula dependencies','inventoryDependencies').addToUi();
}

function runIntegrityAudit() {
  const ss=SpreadsheetApp.getActive();
  const source=ss.getSheetByName('Source').getDataRange().getValues();
  if(source.length!==7 || source[0].length!==6) throw new Error('Demo formula bounds require exactly six records and six columns');
  validateRows(source);
  SpreadsheetApp.flush();
  const before=ss.getSheetByName('Baseline').getRange('B2:B9').getValues().flat();
  const after=ss.getSheetByName('Refactored').getRange('B2:B9').getValues().flat();
  const names=ss.getSheetByName('Baseline').getRange('A2:A9').getValues().flat();
  const rows=names.map((n,i)=>{
    const valid=typeof before[i]==='number' && Number.isFinite(before[i]) && typeof after[i]==='number' && Number.isFinite(after[i]);
    return [n,before[i],after[i],valid?after[i]-before[i]:'INVALID',valid&&Math.abs(after[i]-before[i])<1e-10?'PASS':'FAIL'];
  });
  const audit=ss.getSheetByName('Audit');
  audit.getRange('A1:E9').setValues([['Metric','Before','After','Delta','Result'],...rows]);
  audit.getRange('A12:B13').setValues([['Execution UTC',new Date().toISOString()],['Engine','Google Apps Script']]);
  if(rows.some(r=>r[4]!=='PASS')) throw new Error('Reporting values changed. Inspect Audit.');
  return rows;
}

function extractReferences(formula) {
  const refs=[...formula.matchAll(/(?:'([^']+)'|([A-Za-z_][A-Za-z0-9_]*))!\$?([A-Z]+)\$?(\d+)(?::\$?([A-Z]+)\$?(\d+))?/g)].map(m=>({sheet:m[1]||m[2],range:m[3]+m[4]+(m[5]?':'+m[5]+m[6]:'')}));
  return {refs,needsReview:/INDIRECT|IMPORTRANGE|OFFSET|\[[^\]]+\]/i.test(formula)};
}

function inventoryDependencies() {
  const ss=SpreadsheetApp.getActive();
  const rows=[['Consumer','Formula','Known source','Review']];
  ss.getSheets().filter(s=>!['Dependencies','Audit'].includes(s.getName())).forEach(s=>{
    s.getDataRange().getFormulas().forEach((row,r)=>row.forEach((f,c)=>{
      if(!f) return;
      const p=extractReferences(f);
      rows.push([s.getName()+'!'+s.getRange(r+1,c+1).getA1Notation(),"'"+f,p.refs.map(x=>x.sheet+'!'+x.range).join(', '),p.needsReview?'MANUAL REVIEW':'Static references only']);
    }));
  });
  rows.push(['External consumers','Not discoverable from local formulas','Owner confirmation required','DO NOT DELETE unreferenced tabs automatically']);
  let target=ss.getSheetByName('Dependencies')||ss.insertSheet('Dependencies');
  target.clearContents(); target.getRange(1,1,rows.length,4).setValues(rows);
}

if(typeof module!=='undefined') module.exports={validateRows,extractReferences};
