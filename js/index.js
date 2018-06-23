const d = document
const arrAdicionalesComunes = [
	{
		nombre:'Separador',
		desc: `Básicamente separa las oraciones`,
		htmlTag: 'p'
	},
	{
		nombre:'Subtítulo',
		desc: `Subtítulo`,
		htmlTag: 'h3'
	},
	{
		nombre:'Imagen',
		desc: `URL de imagen`,
		htmlTag: 'img',
		htmlAttr: 'src'
	},
	{
		nombre:'HTML',
		desc: `Cualquier bloque de HTML`,
		htmlTag: 'div'
	},
	{
		nombre:'Código',
		desc: `Código de algún lenguaje de programación - monospace`,
		htmlTag: 'pre',
		regexReplace: [['<','&lt;'],['>','&gt;']]
	}
]
const estructuraPlantilla = [
	{
		seccion: 'Título del Post',
		partes: [
			{
				nombre:'Título',
				desc: `Título del artículo`,
				htmlTag: 'h1'
			}
		],
		adicionales: arrAdicionalesComunes.concat([

		])
	},
	{
		seccion: 'Introducción',
		partes: [
			{
				nombre:'Oración de apertura',
				desc: `Esta es una oración que abre la discusión sobre el tema en particular. ` +
							`El objetivo de esta es llamar la atención del lector, puede ser planteada a través de una pregunta.`,
				htmlTag: 'span'
			},
			{
				nombre:'Contexto',
				desc: `El lector necesita información relevante sobre el tema que será abordado.`,
				htmlTag: 'span'
			},
			{
				nombre:'Planteamiento de la Tesis',
				desc: `Se presenta la idea que se pretende discutir o presentar a lo largo del texto.`,
				htmlTag: 'span'
			}
		],
		adicionales: arrAdicionalesComunes.concat([
			0, 1, 2
		])
	},
	{
		seccion: 'Cuerpo',
		partes: [
			{
				nombre:'Idea Principal',
				desc: `Se presenta la idea general del párrafo.`,
				htmlTag: 'span'
			},
			{
				nombre:'Evidencia',
				desc: `Se describe información relevante que soporte la idea principal del párrafo. Se pueden utilizar citas, estadísticas, testimonios, etc.`,
				htmlTag: 'span'
			},
			{
				nombre:'Análisis',
				desc: `El autor debe hacer un análisis de la información que presenta como su evidencia, de manera que haga clara su posición frente al tema​.`,
				htmlTag: 'span'
			},
			{
				nombre:'Transición (opcional)',
				desc: `Se escribe una frase que permita ir al siguiente párrafo de soporte.`,
				htmlTag: 'span'
			}
		],
		adicionales: arrAdicionalesComunes.concat([
			0, 1, 2, 3
		])
	},
	{
		seccion: 'Conclusión',
		partes: [
			{
				nombre:'conclusión',
				desc: `Se hace una revisión de las ideas más importantes que fueron discutidas en el texto. Además, se proponen soluciones o pasos a seguir de acuerdo con el tema discutido. Muestre cómo su análisis se ha desarrollado a través del texto. Plantee preguntas que animen a su audiencia a responder`,
				htmlTag: 'span'
			}
		],
		adicionales: arrAdicionalesComunes.concat([
			0
		])
	}
]

inicializar()

function cargarEstructura(){
	const estructura = estructuraPlantilla;
	montarPlantilla( estructura )
}

function montarPlantilla( estructura ){

	estructura.forEach( (sec, i) => {

		const $seccion = d.createElement('div')
					$seccion.classList.add('seccion')
					$seccion.classList.add(`s-${i}`)
		const $panelPlantilla = document.querySelector('.panel-plantilla')
		$panelPlantilla.appendChild( $seccion )

		const $etq2 = d.createElement('label')
		const etqParte = estructuraPlantilla[i]['seccion']
			$etq2.classList.add('etq')
			$etq2.textContent = etqParte
		$seccion.appendChild($etq2)
			
		sec.partes.forEach( (parte, j) => {
			crearElementoParte( parte, i, j )
		})
	})
}

function clickTab( n ){
	const $tabActivo = d.querySelector('.tab.activo')
				$tabActivo && $tabActivo.classList.remove('activo')
	const $tabNuevo = d.querySelectorAll('.tab')[n]
				$tabNuevo.classList.add('activo')
	const $panelActivo = d.querySelector('.panel.activo')
				$panelActivo && $panelActivo.classList.remove('activo')
	const $panelNuevo = d.querySelectorAll('.panel')[n]
				$panelNuevo.classList.add('activo')
}

function actualizarPreview(){
	const $elementos = d.querySelectorAll('.panel-plantilla .texto')
	const $panelPreview = d.querySelector('.panel-preview')
				$panelPreview.innerHTML = ''
	const $articulo = d.createElement('article')
				$articulo.classList.add('articulo')
	
	$elementos.forEach( (el, i) => {
		const htmlTag = el.getAttribute('data-html')
		const htmlAttr = el.getAttribute('data-template')
		var regexReplace = el.getAttribute('data-regex-replace')

		const $elemento = d.createElement( htmlTag )

		if( htmlAttr ){
			$elemento.setAttribute(htmlAttr, el.value)
		} else {
			$elemento.innerHTML = el.value
		}
		if( regexReplace ){
			const x = decodeURI(regexReplace)
			const arrRegex = JSON.parse( x )
			if(!Array.isArray( arrRegex ) ){
				regexReplace = [arrRegex]
			}
			var texto = el.value
			arrRegex.forEach( rgx => {
				const exp = new RegExp( rgx[0], 'gm' )
				const nuevoVal = texto.replace( exp, rgx[1] )
				texto = nuevoVal
			})
			$elemento.innerHTML = texto
		} else {
			$elemento.innerHTML = el.value
		}
		
		$articulo.appendChild( $elemento )
	})
	$panelPreview.appendChild( $articulo )
}

function clickHandler (ev, fnc) {
	const $this = ev.target
	$this.classList.add('clicked')
	const ti = setTimeout((($this)=>{
		$this.classList.remove('clicked')
	}).bind(this, $this), 700)
	
	fnc && fnc()
}

function cargarModalAdicionales( seccion, parte ){
	const adicionales = estructuraPlantilla[ ~~seccion ].adicionales
	const $dialogo = document.querySelector(
		'.modal.adicionales .dialogo .contenidoDialogo'
	)
	var htmlDialogo = ''
	adicionales.forEach( (el, i) => {
		const adicional = i
		if( !isNaN( el ) ){
			 el = estructuraPlantilla[ ~~seccion ]['partes'][~~el]
		}
		htmlDialogo += `
			<div class='opcion'
				onclick = 'agregarParteSeleccionada( ${seccion}, ${parte}, ${adicional} )'
			>
				<div class='tappable'>${el.nombre}</div>
			</div>
		`
	})
	$dialogo.innerHTML = htmlDialogo
}

function crearModalAdicionales(){
	console.clear();
	const $modal = document.createElement('div')
				$modal.classList.add('modal')
				$modal.classList.add('adicionales')
				$modal.classList.add('oculto')
				$modal.innerHTML = `
					<div class='dialogo'>
						<div class='cabecera'>Agregar bloque</div>
						<div class='contenidoDialogo'> --- </div>
						<!--div class='pie'>Seleccionar</div-->
					</div>
				`
	$modal.addEventListener('click', ( ev ) => {
		ev.stopPropagation();
		toggleModal('.adicionales')
	})
	document.body.appendChild( $modal )
}

function toggleModal( selector ) {
	const $modal = document.querySelector('.modal'+selector)
	$modal.classList.toggle('oculto')
}

function agregarParte( obj ){
	const seccion = obj.getAttribute('data-seccion')
	const parte = obj.getAttribute('data-parte')
	cargarModalAdicionales( seccion, parte )
	toggleModal('.adicionales')
}

function agregarParteSeleccionada( seccion, parte, adicional ){
	const $parte = document.querySelector(`.p-${seccion}-${parte}`)
				$parte.classList.remove('activo')
				$parte.classList.add('colapsed')
console.log( seccion, parte, adicional )
	const $nuevoElemento = crearElementoParte( parte, seccion, adicional, true)
				$nuevoElemento.classList.add('activo')
				$nuevoElemento.appendAfter( $parte )
	const t = setTimeout(( $nE => {
		$nE.classList.remove('activo')
	}).bind(this, $nuevoElemento), 2000)
}

function crearElementoParte( parte, seccion, adicional, esAdicional = false ){

	const nuevaI = document.querySelectorAll('.s-'+seccion+' .parte').length

	const $etq = d.createElement('div')
				$etq.classList.add('etq')

	const $expand = document.createElement('div')
				$expand.setAttribute('data-parte', seccion+'-'+nuevaI)
				$expand.classList.add('colapsable')
				$expand.innerHTML = `▼` 

				$expand.addEventListener('click', ev => {
					const dataParte = ev.target.getAttribute('data-parte')
					const $seccionC = d.querySelector('.p-'+dataParte)
								$seccionC &&
								$seccionC.classList.toggle('colapsed')
				})
	$etq.appendChild($expand)

	const $etqt = document.createElement('div')
	var etqPart = ''
			if( !esAdicional && isNaN( parte ) ){
				etqPart = parte.nombre
			} else {
				etqPart = estructuraPlantilla[seccion]['adicionales'][adicional]['nombre']
			}
			$etqt.innerHTML = etqPart

			$etq.appendChild($etqt)
	const $parte = d.createElement('div')
				$parte.setAttribute('data-seccion', seccion)
				$parte.classList.add('parte')
	!esAdicional && $parte.classList.add('colapsed')
				$parte.classList.add('p-'+seccion+'-'+nuevaI)
	$parte.appendChild($etq)

	const $seccion = document.querySelector('.s-'+seccion)
	
	const $texto = d.createElement('textarea')
				$texto.classList.add('t-'+seccion+'-'+nuevaI)

	var txtPlaceholder = ''
	var htmlTag = ''
	var htmlAttr = ''
	var regexReplace = ''

	if( !isNaN( parte ) ){
		parte = estructuraPlantilla[seccion]['adicionales'][adicional]
	}
	txtPlaceholder = parte.desc
	htmlTag = parte.htmlTag
	htmlAttr = parte.htmlAttr
	regexReplace = parte.regexReplace

	$texto.setAttribute('data-html', htmlTag)
	if(htmlAttr){
		$texto.setAttribute('data-template', htmlAttr)
	}
	if(regexReplace){
		$texto.setAttribute('data-regex-replace', encodeURI( JSON.stringify( regexReplace ) ) )
	}
	$texto.placeholder = txtPlaceholder
	$texto.classList.add('texto')

	$parte.appendChild($texto)
	
	const $acciones = d.createElement('div')
				$acciones.classList.add('acciones')
	const $ac1 = d.createElement('div')
				$ac1.setAttribute('data-parte', seccion+'-'+nuevaI)
				$ac1.classList.add('clickable')
				$ac1.innerHTML = `👁`      
				
				
				$ac1.addEventListener('click', ev => {
					clickHandler( ev, ()=>{
						const p = ev.target.getAttribute('data-parte')
						const $secc = document.querySelector(`.p-${p}`)
						$secc.classList.toggle('oculto')
					})
				})
	$acciones.appendChild($ac1)
	$parte.appendChild($acciones)
	
	const $acciones2 = d.createElement('div')
				$acciones2.innerHTML = `
						<div
							class = 'clickable'
							data-seccion = '${seccion}'
							data-parte = '${nuevaI}'
							title = 'Agregar bloque'
							onclick ='agregarParte(this)'>
						+ </div>
					</div>
				`
	$acciones2.classList.add('acciones2')

	if (esAdicional){
		const $sep = d.createElement('div')
					$sep.style.flex = 1
		const $ac2 = d.createElement('div')
		$ac2.title = 'Eliminar este bloque'
		$ac2.setAttribute('data-parte', seccion+'-'+nuevaI)
		$ac2.classList.add('clickable')
		$ac2.innerHTML = `❌`      
		
		$ac2.addEventListener('click', ev => {
			clickHandler( ev, ()=>{
				const p = ev.target.getAttribute('data-parte')
				const $secc = document.querySelector(`.p-${p}`)
				$secc.remove()
			})
		})
		$acciones2.appendChild($sep)
		$acciones2.appendChild($ac2)
	}
	$parte.appendChild($acciones2)

	if( esAdicional ){
		return $parte
	} else {
		$seccion.appendChild($parte)
		const $panelPlantilla = d.querySelector('.panel-plantilla')
		$panelPlantilla.append( $seccion )
	}
}



function inicializar(){
	const $tabPlantilla = d.querySelector('.tab-plantilla')
	const $tabPreview = d.querySelector('.tab-preview')

	$tabPlantilla.addEventListener('click', clickTab.bind(this, 0) )
	$tabPreview.addEventListener('click', ev => {
		actualizarPreview()
		clickTab(1)
	})
	crearModalAdicionales()
	cargarEstructura()
	clickTab(0)
}



// ------ Funciones de terceros ---------
// ------ fuente: https://jsfiddle.net/zwm360z2/288/
/* Adds Element BEFORE NeighborElement */
Element.prototype.appendBefore = function (element) {
		element.parentNode.insertBefore(this, element);
}, false;
/* Adds Element AFTER NeighborElement */
Element.prototype.appendAfter = function (element) {
		element.parentNode.insertBefore(this, element.nextSibling);
}, false;
// -------