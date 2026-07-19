// Dev preview: one boat-card config, rendered once per card_style.
import '../src/boat-card.ts';

// ---- HA element stubs (Shadow DOM, never touch light DOM) ----
const def = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
def('ha-card', class extends HTMLElement { connectedCallback(){ this.style.display='block'; } });
def('ha-icon', class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:'open'}).innerHTML =
    '<span style="display:inline-grid;place-items:center;width:var(--mdc-icon-size,20px);height:var(--mdc-icon-size,20px)">' +
    '<span style="width:70%;height:70%;border:2px solid currentColor;border-radius:4px;opacity:.5"></span></span>'; }
  set icon(v){ this.setAttribute('icon', String(v)); } get icon(){ return this.getAttribute('icon'); }
});
def('ha-camera-stream', class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:'open'}).innerHTML =
    '<style>:host{display:block;width:100%;height:100%}</style>' +
    '<div style="width:100%;height:100%;display:grid;place-items:center;color:#9fb4d6;' +
    'background:repeating-linear-gradient(45deg,#1b2a44,#1b2a44 12px,#22354f 12px,#22354f 24px)">● LIVE</div>'; }
});

// ---- mock hass ----
const s = (id, st, attr={}) => ({ entity_id:id, state:String(st), attributes:attr, last_changed:'', last_updated:'' });
let darkMode = false;
const hass = () => ({
  language:'de', locale:{language:'de'}, themes:{ darkMode },
  states: {
    'sensor.solar_power': s('sensor.solar_power',25,{unit_of_measurement:'W',friendly_name:'Solar'}),
    'sensor.solar_main_power': s('sensor.solar_main_power',21,{unit_of_measurement:'W'}),
    'sensor.solar_main_yield_today': s('sensor.solar_main_yield_today',90,{unit_of_measurement:'Wh'}),
    'sensor.battery_soc': s('sensor.battery_soc',78,{unit_of_measurement:'%',friendly_name:'Batterie'}),
    'sensor.battery_voltage': s('sensor.battery_voltage',12.9,{unit_of_measurement:'V'}),
    'sensor.battery_current': s('sensor.battery_current',2.1,{unit_of_measurement:'A'}),
    'sensor.motor_battery_soc': s('sensor.motor_battery_soc',64,{unit_of_measurement:'%'}),
    'sensor.motor_battery_voltage': s('sensor.motor_battery_voltage',12.6,{unit_of_measurement:'V'}),
    'sensor.fridge_temperature': s('sensor.fridge_temperature',6.4,{unit_of_measurement:'°C',friendly_name:'Kühlschrank'}),
    'sensor.water_temperature': s('sensor.water_temperature',18.2,{unit_of_measurement:'°C',friendly_name:'Wasser'}),
    'sensor.boat_speed': s('sensor.boat_speed',4.2,{unit_of_measurement:'kn'}),
    'sensor.boat_heading': s('sensor.boat_heading',118,{unit_of_measurement:'°'}),
    'device_tracker.boat': s('device_tracker.boat','not_home',{latitude:51.3705,longitude:7.4523}),
    'switch.fridge': s('switch.fridge','on',{friendly_name:'Kühlschrank'}),
    'switch.depth_sounder': s('switch.depth_sounder','off',{friendly_name:'Echolot'}),
    'switch.nav_lights': s('switch.nav_lights','off',{friendly_name:'Licht'}),
    'switch.camera_power': s('switch.camera_power','on',{friendly_name:'Kamera'}),
    'camera.mast': s('camera.mast','streaming',{friendly_name:'Mast',entity_picture:''}),
    'select.mast_ptz_preset': s('select.mast_ptz_preset','Steg',{options:['Steg','Cockpit','Bug']}),
  },
  callService: (...a)=>{ console.log('callService',a); return Promise.resolve(); },
  callWS: (msg)=>{
    // fake recorder history: a plausible wavy curve per requested entity
    if (msg && msg.type === 'history/history_during_period') {
      const start = new Date(msg.start_time).getTime() / 1000;
      const end = new Date(msg.end_time).getTime() / 1000;
      const out = {};
      (msg.entity_ids || []).forEach((id, k) => {
        const base = { 'sensor.battery_soc':70, 'sensor.motor_battery_soc':60, 'sensor.solar_power':18, 'sensor.solar_main_power':18, 'sensor.water_temperature':17 }[id] ?? 20;
        const pts = [];
        for (let t = start; t <= end; t += 3600) {
          const day = (t / 86400) | 0;
          pts.push({ s: String(base + Math.sin(t/43200 + k) * base*0.18 + Math.sin(day + k) * base*0.08), lu: t });
        }
        out[id] = pts;
      });
      return Promise.resolve(out);
    }
    return Promise.resolve({});
  },
});

const sections = [
  { type:'boat', variant:'dock', show_variant_switch:true,
    chips:[
      { entity:'sensor.solar_power', icon:'mdi:solar-power', color:'amber', positions:{ dock:{x:58,y:26,dot:'left'} } },
      { entity:'sensor.battery_soc', icon:'mdi:battery', color:'green', positions:{ dock:{x:40,y:66,dot:'right'} } },
      { entity:'sensor.water_temperature', icon:'mdi:coolant-temperature', color:'light-blue', positions:{ dock:{x:22,y:78,dot:'top-right'} } },
    ],
    gps:{ speed:'sensor.boat_speed', heading:'sensor.boat_heading', location:'device_tracker.boat' },
    controls:[
      { entity:'switch.fridge', icon:'mdi:fridge-outline', name:'Kühlung' },
      { entity:'switch.depth_sounder', icon:'mdi:altimeter', name:'Echolot' },
      { entity:'switch.nav_lights', icon:'mdi:lightbulb', name:'Licht' },
      { entity:'switch.camera_power', icon:'mdi:cctv', name:'Kamera' },
    ] },
  { type:'battery', name:'Hauptbatterie', soc:'sensor.battery_soc', voltage:'sensor.battery_voltage', current:'sensor.battery_current' },
  { type:'battery', name:'Motorbatterie', soc:'sensor.motor_battery_soc', voltage:'sensor.motor_battery_voltage' },
  { type:'solar', name:'Solar Hauptmodul', power:'sensor.solar_main_power', yield_today:'sensor.solar_main_yield_today' },
  { type:'fridge', switch:'switch.fridge', temperature:'sensor.fridge_temperature' },
  { type:'sensor', name:'Wassertemp.', entity:'sensor.water_temperature', icon:'mdi:coolant-temperature' },
  { type:'camera', camera:'camera.mast', switch:'switch.camera_power', ptz:true, presets:'select.mast_ptz_preset' },
];

const STYLES = ['default','glass','material','bubble','mirror'];
const app = document.getElementById('app');
const cards = [];
for (const style of STYLES) {
  const wrap = document.createElement('div');
  wrap.className = 'stylecard';
  const label = document.createElement('div');
  label.className = 'label';
  label.textContent = 'card_style: ' + style;
  const card = document.createElement('boat-card');
  card.setConfig({ type:'custom:boat-card', title:'Hoppetosse', card_style:style, columns:2, sections });
  card.hass = hass();
  wrap.appendChild(label); wrap.appendChild(card);
  app.appendChild(wrap);
  cards.push(card);
}

window.__toggleTheme = () => {
  document.body.classList.toggle('dark');
  darkMode = document.body.classList.contains('dark');
  cards.forEach((c) => (c.hass = hass()));
};
window.__cards = cards;
