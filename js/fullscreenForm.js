/**Cerrar modalframes */
const modal_container = document.getElementById('modal_container');
const modal_container2 = document.getElementById('modal_container2');
const close = document.getElementById('close');


close.addEventListener('click', () => {
	modal_container.classList.remove('show');
	location.reload();					  
});

close.addEventListener('click', () => {
	modal_container2.classList.remove('show2');
	location.reload();					  
});

/** Evento de Data info */


  /** Funciones default  */
;( function( window ) {
	
	'use strict';

	var support = { animations : Modernizr.cssanimations },
		animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];

	/**
	 * extend obj function
	 */
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	/**
	 * createElement function
	 * creates an element with tag = tag, className = opt.cName, innerHTML = opt.inner and appends it to opt.appendTo
	 */
	function createElement( tag, opt ) {
		var el = document.createElement( tag )
		if( opt ) {
			if( opt.cName ) {
				el.className = opt.cName;
			}
			if( opt.inner ) {
				el.innerHTML = opt.inner;
			}
			if( opt.appendTo ) {
				opt.appendTo.appendChild( el );
			}
		}	
		return el;
	}

	/**
	 * FForm function
	 */
	function FForm( el, options ) {
		this.el = el;
		this.options = extend( {}, this.options );
  		extend( this.options, options );
  		this._init();
	}

	/**
	 * FForm options
	 */
	FForm.prototype.options = {
		// show progress bar
		ctrlProgress : true,
		// show navigation dots
		ctrlNavDots : true,
		// show [current field]/[total fields] status
		ctrlNavPosition : true,
		// reached the review and submit step
		onReview : function() { return false; }
	};

	/**
	 * init function
	 * initialize and cache some vars
	 */
	FForm.prototype._init = function() {
		// the form element
		this.formEl = this.el.querySelector( 'form' );

		// list of fields
		this.fieldsList = this.formEl.querySelector( 'ol.fs-fields' );

		// current field position
		this.current = 0;

		// all fields
		this.fields = [].slice.call( this.fieldsList.children );
		
		// total fields
		this.fieldsCount = this.fields.length;
		
		// show first field
		classie.add( this.fields[ this.current ], 'fs-current' );

		// create/add controls
		this._addControls();

		// create/add messages
		this._addErrorMsg();
		
		// init events
		this._initEvents();
	};

	/**
	 * addControls function
	 * create and insert the structure for the controls
	 */
	FForm.prototype._addControls = function() {
		// main controls wrapper
		this.ctrls = createElement( 'div', { cName : 'fs-controls', appendTo : this.el } );

		// continue button (jump to next field)
		this.ctrlContinue = createElement( 'button', { cName : 'fs-continue', inner : 'Continue', appendTo : this.ctrls } );
		this._showCtrl( this.ctrlContinue );

		// navigation dots
		if( this.options.ctrlNavDots ) {
			this.ctrlNav = createElement( 'nav', { cName : 'fs-nav-dots', appendTo : this.ctrls } );
			var dots = '';
			for( var i = 0; i < this.fieldsCount; ++i ) {
				dots += i === this.current ? '<button class="fs-dot-current"></button>' : '<button disabled></button>';
			}
			this.ctrlNav.innerHTML = dots;
			this._showCtrl( this.ctrlNav );
			this.ctrlNavDots = [].slice.call( this.ctrlNav.children );
		}

		// field number status
		if( this.options.ctrlNavPosition ) {
			this.ctrlFldStatus = createElement( 'span', { cName : 'fs-numbers', appendTo : this.ctrls } );

			// current field placeholder
			this.ctrlFldStatusCurr = createElement( 'span', { cName : 'fs-number-current', inner : Number( this.current + 1 ) } );
			this.ctrlFldStatus.appendChild( this.ctrlFldStatusCurr );

			// total fields placeholder
			this.ctrlFldStatusTotal = createElement( 'span', { cName : 'fs-number-total', inner : this.fieldsCount } );
			this.ctrlFldStatus.appendChild( this.ctrlFldStatusTotal );
			this._showCtrl( this.ctrlFldStatus );
		}

		// progress bar
		if( this.options.ctrlProgress ) {
			this.ctrlProgress = createElement( 'div', { cName : 'fs-progress', appendTo : this.ctrls } );
			this._showCtrl( this.ctrlProgress );
		}
	}

	/**
	 * addErrorMsg function
	 * create and insert the structure for the error message
	 */
	FForm.prototype._addErrorMsg = function() {
		// error message
		this.msgError = createElement( 'span', { cName : 'fs-message-error', appendTo : this.el } );
	}

	/**
	 * init events
	 */
	FForm.prototype._initEvents = function() {
		var self = this;

		// show next field
		this.ctrlContinue.addEventListener( 'click', function() {
			self._nextField(); 
		} );

		// navigation dots
		if( this.options.ctrlNavDots ) {
			this.ctrlNavDots.forEach( function( dot, pos ) {
				dot.addEventListener( 'click', function() {
					self._showField( pos );
				} );
			} );
		}

		// jump to next field without clicking the continue button (for fields/list items with the attribute "data-input-trigger")
		this.fields.forEach( function( fld ) {
			if( fld.hasAttribute( 'data-input-trigger' ) ) {
				var input = fld.querySelector( 'input[type="radio"]' ) || /*fld.querySelector( '.cs-select' ) ||*/ fld.querySelector( 'select' ); // assuming only radio and select elements (TODO: exclude multiple selects)
				if( !input ) return;

				switch( input.tagName.toLowerCase() ) {
					case 'select' : 
						input.addEventListener( 'change', function() { self._nextField(); } );
						break;

					case 'input' : 
						[].slice.call( fld.querySelectorAll( 'input[type="radio"]' ) ).forEach( function( inp ) {
							inp.addEventListener( 'change', function(ev) { self._nextField(); } );
						} ); 
						break;

					/*
					// for our custom select we would do something like:
					case 'div' : 
						[].slice.call( fld.querySelectorAll( 'ul > li' ) ).forEach( function( inp ) {
							inp.addEventListener( 'click', function(ev) { self._nextField(); } );
						} ); 
						break;
					*/
				}
			}
		} );

		// keyboard navigation events - jump to next field when pressing enter
		document.addEventListener( 'keydown', function( ev ) {
			if( !self.isLastStep && ev.target.tagName.toLowerCase() !== 'textarea' ) {
				var keyCode = ev.keyCode || ev.which;
				if( keyCode === 13 ) {
					ev.preventDefault();
					self._nextField();
				}
			}
		} );
	};

	/**
	 * nextField function
	 * jumps to the next field
	 */
	FForm.prototype._nextField = function( backto ) {
		if( this.isLastStep || !this._validade() || this.isAnimating ) {
			return false;
		}
		this.isAnimating = true;

		// check if on last step
		this.isLastStep = this.current === this.fieldsCount - 1 && backto === undefined ? true : false;
		
		// clear any previous error messages
		this._clearError();

		// current field
		var currentFld = this.fields[ this.current ];

		// save the navigation direction
		this.navdir = backto !== undefined ? backto < this.current ? 'prev' : 'next' : 'next';

		// update current field
		this.current = backto !== undefined ? backto : this.current + 1;

		if( backto === undefined ) {
			// update progress bar (unless we navigate backwards)
			this._progress();

			// save farthest position so far
			this.farthest = this.current;
		}

		// add class "fs-display-next" or "fs-display-prev" to the list of fields
		classie.add( this.fieldsList, 'fs-display-' + this.navdir );

		// remove class "fs-current" from current field and add it to the next one
		// also add class "fs-show" to the next field and the class "fs-hide" to the current one
		classie.remove( currentFld, 'fs-current' );
		classie.add( currentFld, 'fs-hide' );
		
		if( !this.isLastStep ) {
			// update nav
			this._updateNav();

			// change the current field number/status
			this._updateFieldNumber();

			var nextField = this.fields[ this.current ];
			classie.add( nextField, 'fs-current' );
			classie.add( nextField, 'fs-show' );
		}

		// after animation ends remove added classes from fields
		var self = this,
			onEndAnimationFn = function( ev ) {
				if( support.animations ) {
					this.removeEventListener( animEndEventName, onEndAnimationFn );
				}
				
				classie.remove( self.fieldsList, 'fs-display-' + self.navdir );
				classie.remove( currentFld, 'fs-hide' );

				if( self.isLastStep ) {
					// show the complete form and hide the controls
					self._hideCtrl( self.ctrlNav );
					self._hideCtrl( self.ctrlProgress );
					self._hideCtrl( self.ctrlContinue );
					self._hideCtrl( self.ctrlFldStatus );
					// replace class fs-form-full with fs-form-overview
					classie.remove( self.formEl, 'fs-form-full' );
					classie.add( self.formEl, 'fs-form-overview' );
					classie.add( self.formEl, 'fs-show' );
					// callback
					self.options.onReview();
				}
				else {
					classie.remove( nextField, 'fs-show' );
					
					if( self.options.ctrlNavPosition ) {
						self.ctrlFldStatusCurr.innerHTML = self.ctrlFldStatusNew.innerHTML;
						self.ctrlFldStatus.removeChild( self.ctrlFldStatusNew );
						classie.remove( self.ctrlFldStatus, 'fs-show-' + self.navdir );
					}
				}
				self.isAnimating = false;
			};


		var qa11 = document.getElementById('qa1');
		var qb21 = document.getElementById('qb2');
		var qc11 = document.getElementById('qc1');
		var qd21 = document.getElementById('qd2');
		var qe11 = document.getElementById('qe1');
		var qf21 = document.getElementById('qf2');
		var qg21 = document.getElementById('qg2');
		var tex0=document.getElementById('datosini');
		var tex1 = document.getElementById('titulo_modal');
		var tex2 = document.getElementById('ayuda_modal');

		var nom1 = document.getElementById('fname').value;
		var nuin1 = document.getElementById('fnuinitia').value;
		var noin1 = document.getElementById('fnoinitia').value;

	
		if( support.animations) {
			/**Esto es para agregar datos de nombre */
			tex0.innerHTML='<strong>Nombre de Initative Owner: </strong>' + nom1 + '<br>' +
			'<strong>No. Iniciativa:</strong> ' + nuin1 + '<br>' +
			'<strong>Nom. Iniciativa:</strong> ' + noin1;	

			if( this.navdir === 'next' ) {			
				if( this.isLastStep ) {
				/** Exepción del stop */
					if (qg21.checked==true){
						tex1.innerHTML= 'Para la implementación de la metodología agile es necesario tener un equipo mínimo de cuatro personas para desarrollar y ejecutar las sesiones';
						tex2.innerHTML = 'Para más información, acude con el agile coach de la organización <A href="mvelasco@rotoplas.com" style="color: blue;"> zosorio@rotoplas.com</A>';
						modal_container.classList.add('show');
					}else{
						document.getElementById("myform").style.display = 'none';
						document.getElementById("img12").src="img/20945391.jpg";
						tex1.innerHTML='Tú iniciativa cumple con los requerimientos iniciales para ser ejecutada por metodología ágil';
						tex2.innerHTML='Para más información, acude con el agile coach de la organización <A href="zosorio@rotoplas.com" style="color: blue;"> zosorio@rotoplas.com</A>';
						modal_container.classList.add('show');
						/**currentFld.querySelector( '.fs-anim-upper' ).addEventListener( animEndEventName, onEndAnimationFn );*/
					}
				}
				else {
				/** Stop para mostrar resultado*/
						if (qa11.checked==true) {
							document.getElementById("myform").style.display = 'none';
							modal_container.classList.add('show');
						}
						else if (qb21.checked==true){
							document.getElementById("myform").style.display = 'none';
							tex1.innerHTML= 'Antes de entrar a un proceso ágil, es necesario realizar la disminución de riesgo de tu iniciativa. El de-risking nos ayudará a disminuir el riesgo de tu propuesta de valor a través de procesos de experimentación';
							tex2.innerHTML = 'Para poder llevar a cabo esta activdad, te recomendamos acudir con la gerencia de diseño de oferta de valor <A href="nenzastiga@rotoplas.com" style="color: blue;"> nenzastiga@rotoplas.com </A> y experimentación <A href="isanchez@rotoplas.com" style="color: blue;"> isanchez@rotoplas.com.</A>';
							modal_container.classList.add('show');
						}
						else if (qc11.checked==true){
							document.getElementById("myform").style.display = 'none';
							tex1.innerHTML= 'Este tipo de proyectos tienen planes definidos y dependencias necesarias, el trabajo es basado en actividades muy puntuales, con presupuestos establecidos y el equipo no es dedicado.';
							modal_container.classList.add('show');

						}
						else if (qd21.checked==true){
							document.getElementById("myform").style.display = 'none';
							tex1.innerHTML= 'Usualmente los proyectos agile resuelven problemas complejos, soluciones desconocidas y por lo tanto el alcance no está definido con claridad, por ende, esta variable suele ser flexible y dependiente del costo y el tiempo. ';
							tex2.innerHTML = 'Para más información, acude con el agile coach de la organización <A href="zosorio@rotoplas.com" style="color: blue;"> zosorio@rotoplas.com</A>';
							modal_container.classList.add('show');
						}
						else if (qe11.checked==true){
							document.getElementById("myform").style.display = 'none';
							tex1.innerHTML= 'La dependencia de terceros implica el ajuste a planes y servicios que no están en manos de la organización. Por ende, este tipo de iniciativas no es viable llevarlas por agile. ';
							tex2.innerHTML = 'Para más información, acude con el agile coach de la organización <A href="zosorio@rotoplas.com" style="color: blue;"> zosorio@rotoplas.com</A>';
							modal_container.classList.add('show');							
						}
						else if (qf21.checked==true){
							document.getElementById("myform").style.display = 'none';
							tex1.innerHTML= 'En la metodología agile es necesario que exista un responsable tiempo completo de la iniciativa, caso contrario llevar a iniciativa a metodología cascada';
							tex2.innerHTML = 'Para más información, acude con el agile coach de la organización <A href="zosorio@rotoplas.com" style="color: blue;"> zosorio@rotoplas.com</A>';
							modal_container.classList.add('show');

						}
						else if (qg21.checked==true){
							document.getElementById("myform").style.display = 'none';
							tex1.innerHTML= 'Para la implementación de la metodología agile es necesario tener un equipo mínimo de cuatro personas para desarrollar y ejecutar las sesiones';
							tex2.innerHTML = 'Para más información, acude con el agile coach de la organización <A href="zosorio@rotoplas.com" style="color: blue;"> zosorio@rotoplas.com</A>';
							modal_container.classList.add('show');

						}						
						else{
						nextField.querySelector( '.fs-anim-lower' ).addEventListener( animEndEventName, onEndAnimationFn );
							}
					}
				} 
			else {
				console.log("Aquí 2")	
				nextField.querySelector( '.fs-anim-upper' ).addEventListener( animEndEventName, onEndAnimationFn );

			}
		}
		else {
			onEndAnimationFn();
		}
	}

	/**
	 * showField function
	 * jumps to the field at position pos
	 */
	FForm.prototype._showField = function( pos ) {
		if( pos === this.current || pos < 0 || pos > this.fieldsCount - 1 ) {
			return false;
		}
		this._nextField( pos );
	}

	/**
	 * updateFieldNumber function
	 * changes the current field number
	 */
	FForm.prototype._updateFieldNumber = function() {
		if( this.options.ctrlNavPosition ) {
			// first, create next field number placeholder
			this.ctrlFldStatusNew = document.createElement( 'span' );
			this.ctrlFldStatusNew.className = 'fs-number-new';
			this.ctrlFldStatusNew.innerHTML = Number( this.current + 1 );
			
			// insert it in the DOM
			this.ctrlFldStatus.appendChild( this.ctrlFldStatusNew );
			
			// add class "fs-show-next" or "fs-show-prev" depending on the navigation direction
			var self = this;
			setTimeout( function() {
				classie.add( self.ctrlFldStatus, self.navdir === 'next' ? 'fs-show-next' : 'fs-show-prev' );
			}, 25 );
		}
	}

	/**
	 * progress function
	 * updates the progress bar by setting its width
	 */
	FForm.prototype._progress = function() {
		if( this.options.ctrlProgress ) {
			this.ctrlProgress.style.width = this.current * ( 100 / this.fieldsCount ) + '%';
		}
	}

	/**
	 * updateNav function
	 * updates the navigation dots
	 */
	FForm.prototype._updateNav = function() {
		if( this.options.ctrlNavDots ) {
			classie.remove( this.ctrlNav.querySelector( 'button.fs-dot-current' ), 'fs-dot-current' );
			classie.add( this.ctrlNavDots[ this.current ], 'fs-dot-current' );
			this.ctrlNavDots[ this.current ].disabled = false;
		}
	}

	/**
	 * showCtrl function
	 * shows a control
	 */
	FForm.prototype._showCtrl = function( ctrl ) {
		classie.add( ctrl, 'fs-show' );
	}

	/**
	 * hideCtrl function
	 * hides a control
	 */
	FForm.prototype._hideCtrl = function( ctrl ) {
		classie.remove( ctrl, 'fs-show' );
	}

	// TODO: this is a very basic validation function. Only checks for required fields..
	FForm.prototype._validade = function() {
		var fld = this.fields[ this.current ],
			input = fld.querySelector( 'input[required]' ) || fld.querySelector( 'textarea[required]' ) || fld.querySelector( 'select[required]' ),
			error;

		if( !input ) return true;

		switch( input.tagName.toLowerCase() ) {
			case 'input' : 
				if( input.type === 'radio' || input.type === 'checkbox' ) {
					var checked = 0;
					[].slice.call( fld.querySelectorAll( 'input[type="' + input.type + '"]' ) ).forEach( function( inp ) {
						if( inp.checked ) {
							++checked;
						}
					} );
					if( !checked ) {
						error = 'NOVAL';
					}
				}
				else if( input.value === '' ) {
					error = 'NOVAL';
				}
				break;

			case 'select' : 
				// assuming here '' or '-1' only
				if( input.value === '' || input.value === '-1' ) {
					error = 'NOVAL';
				}
				break;

			case 'textarea' :
				if( input.value === '' ) {
					error = 'NOVAL';
				}
				break;
		}

		if( error != undefined ) {
			this._showError( error );
			return false;
		}

		return true;
	}

	// TODO
	FForm.prototype._showError = function( err ) {
		var message = '';
		switch( err ) {
			case 'NOVAL' : 
				message = 'Please fill the field before continuing';
				break;
			case 'INVALIDEMAIL' : 
				message = 'Please fill a valid email address';
				break;
			// ...
		};
		this.msgError.innerHTML = message;
		this._showCtrl( this.msgError );
	}

	// clears/hides the current error message
	FForm.prototype._clearError = function() {
		this._hideCtrl( this.msgError );
	}

	// add to global namespace
	window.FForm = FForm;

})( window );