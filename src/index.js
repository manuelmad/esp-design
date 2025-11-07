// Access to inputs
const wellhead_tbg_pressure = document.getElementById('wellhead_tbg_pressure');
const test_rate = document.getElementById('test_rate');
const test_pressure = document.getElementById('test_pressure');
const datum_depth = document.getElementById('datum_depth');
const water_percentage = document.getElementById('water_percentage');
const water_sg = document.getElementById('water_sg');
const oil_sg = document.getElementById('oil_sg');
const bottom_temp = document.getElementById('bottom_temp');
const static_bottomhole_press = document.getElementById('static_bottomhole_press');
const pump_setting_depth = document.getElementById('pump_setting_depth');
const desired_prod_rate = document.getElementById('desired_prod_rate');
const csg_od = document.getElementById('csg_od');
const csg_nom_weight = document.getElementById('csg_nom_weight');
const tbg_od = document.getElementById('tbg_od');
const tbg_nom_weight = document.getElementById('tbg_nom_weight');
const tbg_id = document.getElementById('tbg_id');


const motor_series = document.getElementById('motor_series');
const seal_series = document.getElementById('seal_series');
const pump_series = document.getElementById('pump_series');

const pump_model = document.getElementById('pump_model');

const head_per_stg = document.getElementById('head_per_stg');
const bhp_per_stg = document.getElementById('bhp_per_stg');

const seal_hp = document.getElementById('seal_hp');

const motor_hp = document.getElementById('motor_hp');
const motor_volts = document.getElementById('motor_volts');
const motor_amps = document.getElementById('motor_amps');
const motor_lenght = document.getElementById('motor_lenght');
const motor_weight = document.getElementById('motor_weight');

const cable_type = document.getElementById('cable_type');
const cable_voltage_drop = document.getElementById('cable_voltage_drop');
const cable_operating_temp = document.getElementById('cable_operating_temp');
const temp_correction_factor = document.getElementById('temp_correction_factor');
const cable_surface_lenght = document.getElementById('cable_surface_lenght');

// Data Object
let data_object = {
	csg_object: {
		od: '', // 7 in
		nomW: 0, // 23 lbf/ft
	},
	tbg_object: {
		od: '', // 2 7/8 in
		id: 0, // 2.441 in
		nomW: 0, // 6.5 lbf/ft
	},
	pump_object: {
		stages: 0,
		bhp: 0,
		pip: 0
	},
	seal_object: {
		hp: 0,
	},
	wellhead_tbg_pressure: 0, // 150 psi
	test_rate: 0, // 900 bpd
	test_pressure: 0, // 985 psi
	datum_depth: 0, // 5350 ft
	water_percentage: 0, // 90%
	water_sg: 0, // 1.02
	oil_sg: 0, // 0.876
	bottom_temp: 0, // 180 °F
	static_bottomhole_press: 0, // 1650 psi
	pump_setting_depth: 0, // 5200 ft
	desired_prod_rate: 0, // 2000 bpd
	ip: 0,
	tdh: 0,
	composite_sg: 0,
	hp: 0,
}

function clearValues() {
	// Clear all values
	data_object.csg_object.od = '';
	data_object.csg_object.nomW = 0;

	data_object.tbg_object.od = '';
	data_object.tbg_object.id = 0;
	data_object.tbg_object.nomW = 0;

	data_object.pump_object.stages = 0;
	data_object.pump_object.bhp = 0;
	data_object.pump_object.pip = 0;

	data_object.seal_object.hp = 0;

	data_object.wellhead_tbg_pressure = 0;
	data_object.test_rate = 0;
	data_object.test_pressure = 0;
	data_object.datum_depth = 0;
	data_object.water_percentage = 0;
	data_object.water_sg = 0;
	data_object.oil_sg = 0;
	data_object.bottom_temp = 0;
	data_object.static_bottomhole_press = 0;
	data_object.pump_setting_depth = 0;
	data_object.desired_prod_rate = 0;
	data_object.ip = 0;
	data_object.tdh = 0;
	data_object.composite_sg = 0;
	data_object.hp = 0;
}

function getValues() {
	// Clear all values
	clearValues();

	// Get all new values
	data_object.csg_object.od = csg_od.value;
	data_object.csg_object.nomW = csg_nom_weight.value;

	data_object.tbg_object.od = tbg_od.value;
	data_object.tbg_object.id = tbg_id.value;
	data_object.tbg_object.nomW = tbg_nom_weight.value;

	data_object.wellhead_tbg_pressure = wellhead_tbg_pressure.value;
	data_object.test_rate = test_rate.value;
	data_object.test_pressure = test_pressure.value;
	data_object.datum_depth = datum_depth.value;
	data_object.water_percentage = water_percentage.value;
	data_object.water_sg = water_sg.value;
	data_object.oil_sg = oil_sg.value;
	data_object.bottom_temp = bottom_temp.value;
	data_object.static_bottomhole_press = static_bottomhole_press.value;
	data_object.pump_setting_depth = pump_setting_depth.value;
	data_object.desired_prod_rate = desired_prod_rate.value;

	console.log('data_object', data_object);
}


function calculateTDH() {
	// Get all values from inputs
	getValues();

	let dataArray = [
		wellhead_tbg_pressure.value,
		test_rate.value,
		test_pressure.value,
		datum_depth.value,
		water_percentage.value,
		water_sg.value,
		oil_sg.value,
		bottom_temp.value,
		static_bottomhole_press.value,
		pump_setting_depth.value,
		desired_prod_rate.value,
		csg_od.value,
		csg_nom_weight.value,
		tbg_od.value,
		tbg_id.value,
		tbg_nom_weight.value
	]

	let check = false;

	dataArray.forEach(data => {
		if(data == 0) {
			showAlert();
			check = true;
		}
	})

	if(check) {
		return;
	}

	// Calculating IP (@ test conditions)
	let productivity_index = data_object.test_rate / (data_object.static_bottomhole_press - data_object.test_pressure);
	data_object.ip = productivity_index;

	// Calculating Well Flowing Pressure (@ desired prod rate)
	let well_flowing_pressure = data_object.static_bottomhole_press - (data_object.desired_prod_rate / productivity_index);

	// Calculating Composite Specific Gravity
	let composite_sg = data_object.water_sg * (data_object.water_percentage / 100) + data_object.oil_sg * ((100-data_object.water_percentage)/100);
	data_object.composite_sg = composite_sg;

	// Calculating pressure in Datum - pump setting depths difference
	let datum_pump_diff_pressure = (data_object.datum_depth - data_object.pump_setting_depth) * composite_sg / 2.31;

	// Calculating Pump Intake Pressure (PIP)
	let pip = well_flowing_pressure - datum_pump_diff_pressure;
	data_object.pump_object.pip = pip;

	// Calculating net dynamic lift
	let net_dynamic_lift = data_object.datum_depth - (well_flowing_pressure * 2.31 / composite_sg);

	// Calculating friction loss
	let friction_loss = 2.083 * ((100/120)**1.85) * ((data_object.desired_prod_rate/34.3)**1.85) * (1/(data_object.tbg_object.id)**4.8655);

	// Calculating total friction loss
	let total_friction_loss = friction_loss * data_object.pump_setting_depth / 1000;

	// Calculating required wellhead tubing pressure
	let req_wellhead_tbg_pressure = data_object.wellhead_tbg_pressure * 2.31 / composite_sg;

	// Calculating total dynamic head
	let tdh = net_dynamic_lift + total_friction_loss + req_wellhead_tbg_pressure;

	data_object.tdh = tdh;

	console.log('tdh', tdh, data_object.tdh);

	// Access to tdh results container and showing such results and next steps
	const tdh_btn_results = document.getElementById('tdh_btn_results');
	tdh_btn_results.innerHTML = `
		<label>El cabezal dinámico total (TDH) es: ${tdh.toFixed(1)} pies.</label>
		<label>Consulte las tablas del fabricante de equipos BES para seleccionar la combinación de tamaños de Motor, Sello y Bomba que mejor se adapte al revestidor de ${data_object.csg_object.od}", ${data_object.csg_object.nomW} lbf/pie.</label>
	`;

	// Showing the sections for next steps
	const series_section = document.getElementById('series_section');
	series_section.style.display = 'block';

	// Code to scroll to the position of the new section
	const element = document.querySelector('#series_section');
	const offset = 100;
	const bodyRect = document.body.getBoundingClientRect().top;
	const elementRect = element.getBoundingClientRect().top;
	const elementPosition = elementRect - bodyRect;
	const offsetPosition = elementPosition + offset;
	
	// A little delay while the section is shown and able to go there
	setTimeout(()=> {
		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	}, 300);

}

// Accessing tdh button and adding calculation event
const tdh_calc_btn = document.getElementById('tdh_calc_btn');
tdh_calc_btn.addEventListener('click', calculateTDH);

// Accessing series button and adding calculation event
const series_btn = document.getElementById('series_btn');
series_btn.addEventListener('click', ()=> {

	let dataArray = [
		motor_series.value,
		seal_series.value,
		pump_series.value,
	]

	let check = false;

	dataArray.forEach(data => {
		if(data == 0) {
			showAlert();
			check = true;
		}
	})

	if(check) {
		return;
	}

	const pump_model_section = document.getElementById('pump_model_section');
	let pumpSeries = pump_series.value;
	const pump_model_description = document.getElementById('pump_model_description');
	pump_model_description.innerHTML = `
		Escoja de la tabla del fabricante de equipos BES el modelo de bomba serie ${pumpSeries} cuyo rango de tasa operativa sea el más adecuado para la tasa de producción deseada (${data_object.desired_prod_rate} BPD).
	`;
	pump_model_section.style.display = 'block';

	// Code to scroll to the position of the new section
	const element = document.querySelector('#pump_model_section');
	const offset = 100;
	const bodyRect = document.body.getBoundingClientRect().top;
	const elementRect = element.getBoundingClientRect().top;
	const elementPosition = elementRect - bodyRect;
	const offsetPosition = elementPosition + offset;
	
	// A little delay while the section is shown and able to go there
	setTimeout(()=> {
		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	}, 300);
});

// Accessing model button and adding calculation event
const model_btn = document.getElementById('model_btn');
model_btn.addEventListener('click', ()=> {

	let dataArray = [
		pump_model.value,
	]

	let check = false;

	dataArray.forEach(data => {
		if(data == 0) {
			showAlert();
			check = true;
		}
	})

	if(check) {
		return;
	}

	const pump_performance_section = document.getElementById('pump_performance_section');
	let pumpSeries = pump_series.value;
	let pumpModel = pump_model.value;
	const pump_performance_description = document.getElementById('pump_performance_description');
	pump_performance_description.innerHTML = `
		Utilice la curva de desempeño de la bomba serie ${pumpSeries}, modelo ${pumpModel} @ 60Hz para revestidor de ${data_object.csg_object.od}" y determine el cabezal por etapa y el BHP por etapa para lograr la tasa de producción deseada (${data_object.desired_prod_rate} BPD).
	`;
	pump_performance_section.style.display = 'block';

	// Code to scroll to the position of the new section
	const element = document.querySelector('#pump_performance_section');
	const offset = 100;
	const bodyRect = document.body.getBoundingClientRect().top;
	const elementRect = element.getBoundingClientRect().top;
	const elementPosition = elementRect - bodyRect;
	const offsetPosition = elementPosition + offset;
	
	// A little delay while the section is shown and able to go there
	setTimeout(()=> {
		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	}, 300);
});

// Accessing performance button and adding calculation event
const performance_btn = document.getElementById('performance_btn');
performance_btn.addEventListener('click', ()=> {

	let dataArray = [
		head_per_stg.value,
		bhp_per_stg.value,
	]

	let check = false;

	dataArray.forEach(data => {
		if(data == 0) {
			showAlert();
			check = true;
		}
	})

	if(check) {
		return;
	}

	const seal_hp_section = document.getElementById('seal_hp_section');
	let sealSeries = seal_series.value;

	const seal_hp_description = document.getElementById('seal_hp_description');
	seal_hp_description.innerHTML = `
		Utilice la curva de potencia del sello serie ${sealSeries}, con el TDH (${data_object.tdh.toFixed(1)} pies), y determine los HP requeridos por los sellos.
	`;
	seal_hp_section.style.display = 'block';

	// Code to scroll to the position of the new section
	const element = document.querySelector('#seal_hp_section');
	const offset = 100;
	const bodyRect = document.body.getBoundingClientRect().top;
	const elementRect = element.getBoundingClientRect().top;
	const elementPosition = elementRect - bodyRect;
	const offsetPosition = elementPosition + offset;
	
	// A little delay while the section is shown and able to go there
	setTimeout(()=> {
		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	}, 300);
});

// Accessing seal hp button and adding calculation event
const seal_hp_btn = document.getElementById('seal_hp_btn');
seal_hp_btn.addEventListener('click', ()=> {

	let dataArray = [
		seal_hp.value,
	]

	let check = false;

	dataArray.forEach(data => {
		if(data == 0) {
			showAlert();
			check = true;
		}
	})

	if(check) {
		return;
	}

	//console.log('head_per_stg.value',head_per_stg.value)
	let reqStages = data_object.tdh / Number(head_per_stg.value);
	//console.log('reqStages', reqStages)
	data_object.pump_object.stages = reqStages;
	//console.log(data_object.pump_object.stages);

	let reqBHP = Number(bhp_per_stg.value) * reqStages * data_object.composite_sg;
	data_object.pump_object.bhp = reqBHP;
	//console.log(data_object.pump_object.bhp);

	const motor_section = document.getElementById('motor_section');
	let motorSeries = Number(motor_series.value);

	let totalHP = Number(data_object.pump_object.bhp) + Number(seal_hp.value);

	data_object.hp = totalHP;

	const motor_description = document.getElementById('motor_description');
	motor_description.innerHTML = `
		Escoja de la tabla del fabricante el motor serie ${motorSeries} que proporcione los HP totales requeridos (${totalHP.toFixed(1)} HP).
	`;
	motor_section.style.display = 'block';

	// Code to scroll to the position of the new section
	const element = document.querySelector('#motor_section');
	const offset = 100;
	const bodyRect = document.body.getBoundingClientRect().top;
	const elementRect = element.getBoundingClientRect().top;
	const elementPosition = elementRect - bodyRect;
	const offsetPosition = elementPosition + offset;
	
	// A little delay while the section is shown and able to go there
	setTimeout(()=> {
		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	}, 300);

});


// Accessing motor button and adding calculation event
const motor_btn = document.getElementById('motor_btn');
motor_btn.addEventListener('click', ()=> {

	let dataArray = [
		motor_hp.value,
		motor_volts.value,
		motor_amps.value,
		motor_lenght.value,
		motor_weight.value,
	]

	let check = false;

	dataArray.forEach(data => {
		if(data == 0) {
			showAlert();
			check = true;
		}
	})

	if(check) {
		return;
	}

	const cable_section = document.getElementById('cable_section');

	const cable_description_1 = document.getElementById('cable_description_1');
	cable_description_1.innerHTML = `
		Utilice la gráfica de tipos de cable del fabricante, con la corriente del motor (${motor_amps.value} amps) y escoja un tipo de cable cuya línea, al ser intersectada, arroje un valor de caída de voltaje menor a 30 volts/1000pies.
	`;

	const cable_description_2 = document.getElementById('cable_description_2');
	cable_description_2.innerHTML = `
		Determine la temperatura operacional del cable entrando en la gráfica correspondiente con la corriente del motor (${motor_amps.value} amps) y la temperatura de fondo del pozo (${data_object.bottom_temp} °F).
	`;

	const cable_description_3 = document.getElementById('cable_description_3');
	cable_description_3.innerHTML = `
		Determine el factor de corrección de temperatura utilizando la tabla correspondiente según el valor de temperatura operacional del cable.
	`;
	cable_section.style.display = 'block';

	// Code to scroll to the position of the new section
	const element = document.querySelector('#cable_section');
	const offset = 100;
	const bodyRect = document.body.getBoundingClientRect().top;
	const elementRect = element.getBoundingClientRect().top;
	const elementPosition = elementRect - bodyRect;
	const offsetPosition = elementPosition + offset;
	
	// A little delay while the section is shown and able to go there
	setTimeout(()=> {
		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	}, 300);
});

// Accessing cable button and adding calculation event
const cable_btn = document.getElementById('cable_btn');
cable_btn.addEventListener('click', ()=> {
	
	let dataArray = [
		cable_type.value,
		cable_voltage_drop.value,
		cable_operating_temp.value,
		temp_correction_factor.value,
		cable_surface_lenght.value,
	]

	let check = false;

	dataArray.forEach(data => {
		if(data == 0) {
			showAlert();
			check = true;
		}
	})

	if(check) {
		return;
	}
	
	let voltage_drop = (Number(cable_voltage_drop.value) / 1000) * (Number(cable_surface_lenght.value) + pump_setting_depth.value* Number(temp_correction_factor.value));
	//console.log(voltage_drop);

	let voltage_drop_percentage = voltage_drop / motor_volts.value * 100;
	//console.log(voltage_drop_percentage);

	let condition;

	if(voltage_drop_percentage < 5) {
		condition = '<li>Colocar VSD para evitar romper el eje al momento de arrancar la bomba.</li>';
	} else if(5 < voltage_drop_percentage < 15) {
		condition = '<li>La caída de voltaje tiene un valor aceptable.</li>';
	} else if(15 < voltage_drop_percentage < 19 ) {
		condition = '<li>Se requiere variable speed controller.</li>';
	} else if (voltage_drop_percentage > 19) {
		condition = '<li>Contactar al fabricante para consideraciones especiales.</li>';
	}


	let surface_voltage = voltage_drop + Number(motor_volts.value);
	//console.log(surface_voltage);

	let kva = surface_voltage * motor_amps.value * 1.73 / 1000;
	//console.log(kva);

	const general_results = document.getElementById('general_results');
	general_results.innerHTML = `
		<p>Data General:</p>
		<ul>
			<li>IP = ${data_object.ip.toFixed(1)} BPD/lpc.</li>
			<li>TDH = ${data_object.tdh.toFixed(1)} pies.</li>
			<li>PIP = ${data_object.pump_object.pip.toFixed(1)} lpc.</li>
		</ul>
		<p>Descripción de la bomba:</p>
		<ul>
			<li>Serie: ${pump_series.value}.</li>
			<li>Modelo: ${pump_model.value}.</li>
			<li>Etapas requeridas: ${data_object.pump_object.stages.toFixed(0)} etapas.</li>
			<li>Potencia requerida: ${data_object.pump_object.bhp.toFixed(0)} HP.</li>
		</ul>
		<p>Descripción del sello:</p>
		<ul>
			<li>Serie: ${seal_series.value}.</li>
			<li>Potencia requerida: ${seal_hp.value} HP.</li>
		</ul>
		<p>Descripción del motor:</p>
		<ul>
			<li>Serie: ${motor_series.value}.</li>
			<li>Potencia: ${motor_hp.value} HP.</li>
			<li>Voltaje: ${motor_volts.value} volts.</li>
			<li>Corriente: ${motor_amps.value} Amps.</li>
			<li>Longitud: ${motor_lenght.value} pies.</li>
			<li>Peso: ${motor_weight.value} lbf.</li>
		</ul>
		<p>Descripción del cable:</p>
		<ul>
			<li>Tipo: ${cable_type.value}.</li>
			<li>Temperatura de operación: ${cable_operating_temp.value} °F.</li>
			<li>% de caída de voltaje respecto a placa del motor: ${voltage_drop_percentage.toFixed(1)} %.</li>
			${condition}
		</ul>
		<p>Requerimiento del transformador:</p>
		<ul>
			<li>Voltaje en superficie: ${surface_voltage.toFixed(1)} volts.</li>
			<li>KVA: ${kva.toFixed(1)} Amps.</li>
		</ul>
	`;
	
	general_results.style.display = 'block';

	// Code to scroll to the position of the new section
	const element = document.querySelector('#general_results');
	const offset = 100;
	const bodyRect = document.body.getBoundingClientRect().top;
	const elementRect = element.getBoundingClientRect().top;
	const elementPosition = elementRect - bodyRect;
	const offsetPosition = elementPosition + offset;
	
	// A little delay while the section is shown and able to go there
	setTimeout(()=> {
		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	}, 300);

	// I can try late to add a link (with HTML2canvas) to download the results as img.
});


