// Dev harness for the visual card editor: renders <boat-card-editor> on the
// left and a live <boat-card> preview on the right, wired via config-changed.
import '../src/boat-card.ts';

// ---- HA element stubs (Shadow DOM, never touch light DOM) ----
const def = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };

def('ha-card', class extends HTMLElement { connectedCallback(){ this.style.display='block'; } });

def('ha-icon', class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:'open'}).innerHTML =
    '<span style="display:inline-grid;place-items:center;width:var(--mdc-icon-size,20px);height:var(--mdc-icon-size,20px)">' +
    '<span style="width:70%;height:70%;border:2px solid currentColor;border-radius:4px;opacity:.5"></span></span>'; }
  set icon(v){ this.setAttribute('icon', String(v)); }
  get icon(){ return this.getAttribute('icon'); }
});

def('ha-icon-button', class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:'open'}).innerHTML =
    '<style>:host{display:inline-block}button{width:var(--mdc-icon-button-size,40px);height:var(--mdc-icon-button-size,40px);' +
    'border:none;background:none;cursor:pointer;color:inherit;border-radius:50%}button:hover{background:rgba(0,0,0,.06)}</style>' +
    '<button><slot></slot></button>'; }
});

def('ha-camera-stream', class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:'open'}).innerHTML =
    '<style>:host{display:block;width:100%;height:100%}</style>' +
    '<div style="width:100%;height:100%;display:grid;place-items:center;color:#9fb4d6;' +
    'background:repeating-linear-gradient(45deg,#1b2a44,#1b2a44 12px,#22354f 12px,#22354f 24px)">● LIVE</div>'; }
});

// ha-form stub: renders a simple <input>/<select>/<checkbox> per scalar field so
// the editor is actually usable in the dev harness (real HA renders rich pickers).
def('ha-form', class extends HTMLElement {
  set hass(v){ this._hass = v; }
  set schema(v){ this._schema = v; this._render(); }
  set data(v){ this._data = v; this._render(); }
  set computeLabel(v){ this._label = v; this._render(); }
  _lab(f){ return (this._label ? this._label(f) : f.name) || f.name; }
  _flat(schema, out){ (schema||[]).forEach(f => { if (f.type === 'grid' || f.type === 'expandable') this._flat(f.schema, out); else out.push(f); }); return out; }
  _render(){
    if (!this.shadowRoot) this.attachShadow({mode:'open'});
    const fields = this._flat(this._schema, []);
    const data = this._data || {};
    this.shadowRoot.innerHTML =
      '<style>.f{display:flex;align-items:center;gap:8px;margin:4px 0;font-size:.82rem}' +
      '.f label{flex:0 0 45%;color:var(--secondary-text-color)}' +
      'input,select{flex:1;padding:5px 7px;border:1px solid var(--divider-color,#ccc);border-radius:6px;font:inherit}</style>' +
      fields.map(f => {
        const val = data[f.name] ?? '';
        const sel = f.selector || {};
        if (sel.boolean) return `<div class="f"><label>${this._lab(f)}</label><input type="checkbox" data-n="${f.name}" ${val?'checked':''}></div>`;
        if (sel.select) { const opts = (sel.select.options||[]).map(o=>`<option value="${o.value}" ${o.value===val?'selected':''}>${o.label||o.value}</option>`).join(''); return `<div class="f"><label>${this._lab(f)}</label><select data-n="${f.name}"><option value=""></option>${opts}</select></div>`; }
        const type = sel.number ? 'number' : 'text';
        return `<div class="f"><label>${this._lab(f)}</label><input type="${type}" data-n="${f.name}" value="${String(val).replace(/"/g,'&quot;')}"></div>`;
      }).join('');
    this.shadowRoot.querySelectorAll('[data-n]').forEach(inp => {
      inp.addEventListener('change', () => {
        const n = inp.getAttribute('data-n');
        let v = inp.type === 'checkbox' ? inp.checked : (inp.type === 'number' ? (inp.value===''?undefined:Number(inp.value)) : inp.value);
        const nd = Object.assign({}, this._data, { [n]: v });
        this.dispatchEvent(new CustomEvent('value-changed', { detail:{ value: nd }, bubbles:true, composed:true }));
      });
    });
  }
});

// ---- mock hass ----
const s = (id, st, attr={}) => ({ entity_id:id, state:String(st), attributes:attr, last_changed:'', last_updated:'' });
const hass = {
  language:'de', locale:{language:'de'}, themes:{ darkMode:false },
  states: {
    'sensor.solar_power': s('sensor.solar_power', 25, {unit_of_measurement:'W', friendly_name:'Solar'}),
    'sensor.battery_soc': s('sensor.battery_soc', 78, {unit_of_measurement:'%', friendly_name:'Batterie'}),
    'sensor.water_temperature': s('sensor.water_temperature', 18.2, {unit_of_measurement:'°C', friendly_name:'Wasser'}),
    'sensor.solar_main_yield_today': s('sensor.solar_main_yield_today', 90, {unit_of_measurement:'Wh'}),
    'switch.fridge': s('switch.fridge','on',{friendly_name:'Kühlschrank'}),
    'switch.depth_sounder': s('switch.depth_sounder','off',{friendly_name:'Echolot'}),
    'switch.nav_lights': s('switch.nav_lights','off',{friendly_name:'Licht'}),
    'switch.camera_power': s('switch.camera_power','on',{friendly_name:'Kamera'}),
    'sensor.boat_speed': s('sensor.boat_speed',4.2,{unit_of_measurement:'kn'}),
    'sensor.battery_voltage': s('sensor.battery_voltage',12.9,{unit_of_measurement:'V'}),
    'sensor.fridge_temperature': s('sensor.fridge_temperature',6.4,{unit_of_measurement:'°C'}),
    'camera.mast': s('camera.mast','streaming',{friendly_name:'Mast',entity_picture:''}),
  },
  callService: (...a)=>{ console.log('callService', a); return Promise.resolve(); },
  callWS: ()=>Promise.resolve({}),
};

let config = {
  type:'custom:boat-card', title:'Hoppetosse', card_style:'default', columns:2,
  sections: [
    { type:'boat', variant:'dock', show_variant_switch:true,
      chips: [
        { entity:'sensor.solar_power', icon:'mdi:solar-power', color:'amber', positions:{ dock:{x:58,y:26,dot:'left'} } },
        { entity:'sensor.battery_soc', icon:'mdi:battery', color:'green', positions:{ dock:{x:40,y:66,dot:'right'} } },
      ],
      controls: [ { entity:'switch.fridge', icon:'mdi:fridge-outline', name:'Kühlung' } ] },
    { type:'battery', name:'Hauptbatterie', soc:'sensor.battery_soc', voltage:'sensor.battery_voltage' },
    { type:'fridge', switch:'switch.fridge', temperature:'sensor.fridge_temperature' },
  ],
};

const editor = document.createElement('boat-card-editor');
editor.hass = hass;
editor.setConfig(config);
document.getElementById('editor').appendChild(editor);

const preview = document.createElement('boat-card');
preview.hass = hass;
preview.setConfig(config);
document.getElementById('preview').appendChild(preview);

editor.addEventListener('config-changed', (e) => {
  config = e.detail.config;
  window.__config = config; // for inspection in tests
  preview.setConfig(config);
  preview.hass = hass;
});
window.__config = config;
window.__editor = editor;
window.__preview = preview;
