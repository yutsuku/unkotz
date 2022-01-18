/**
 * @param {Element} form 
 * @param {Bool} success 
 * @returns 
 */
function updateOutput(form, success) {
  const unixElement = document.querySelector('#unix')
  const relativeElement = document.querySelector('#relative')
  const longElement = document.querySelector('#long')

  if (!success) {
    unixElement.value = ''
    relativeElement.value = ''
    longElement.value = ''

    return
  }

  const timezoneElement = document.querySelector('#timezone')
  const dateElement = document.querySelector('#date')
  const timeElement = document.querySelector('#time')

  const userInput = moment.tz(`${dateElement.value} ${timeElement.value}`, timezoneElement.value)
  const userInputUtc = userInput.clone().utc()

  unixElement.value = userInputUtc.format('X')
  relativeElement.value = `<t:${userInputUtc.format('X')}:R>`
  longElement.value = `<t:${userInputUtc.format('X')}:F>`
}

/**
 * 
 * @param {Element} e Node to attach handler to
 * @param {Element} interestingElement Node to copy information from
 */
function handleCopy(e, interestingElement) {
  e.addEventListener('click', (event, element) => {
    const tooltip = new bootstrap.Tooltip(event.currentTarget , {
      trigger: 'manual'
    })

    e.tooltip = tooltip
    tooltip.show()

    navigator.clipboard.writeText(interestingElement.value).then(() => {

    }, () => {
    });
  })

  e.addEventListener('shown.bs.tooltip', () => {
    setTimeout(() => {
      e.tooltip.hide()
    }, 2000)
  })

  e.addEventListener('hidden.bs.tooltip', () => {
    setTimeout(() => {
      e.tooltip.dispose()
    }, 2000)
  })
}

/**
 * @param {Callable} callback
 */
function validate(callback) {
  var forms = document.querySelectorAll('.needs-validation')

  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.classList.remove('was-validated')
      form.classList.remove('invalid')
      form.classList.remove('valid')

      if (!form.checkValidity()) {
        form.classList.add('invalid')
        callback(form, false)
      } else {
        callback(form, true)
      }

      form.classList.add('was-validated')
    })
}

(function init() {
    const zones = moment.tz.names()
    const now = moment.now()

    const timezoneElement = document.querySelector('#timezone')
    const dateElement = document.querySelector('#date')
    const timeElement = document.querySelector('#time')

    const unixCopyElement = document.querySelector('#copy-unix')
    const longCopyElement = document.querySelector('#copy-long')
    const relativeCopyElement = document.querySelector('#copy-relative')

    zones.forEach((zone) => {
    if (zone === 'Asia/Tokyo') {
        timezoneElement.insertAdjacentHTML('beforeend', `<option value="${zone}" selected>${zone}</option>`)
    } else {
        timezoneElement.insertAdjacentHTML('beforeend', `<option value="${zone}">${zone}</option>`)
    }
    });
    timezoneElement.addEventListener('change', () => { validate(updateOutput) } )

    dateElement.value = moment().format('YYYY-MM-DD');
    dateElement.addEventListener('change', () => { validate(updateOutput) } )

    timeElement.value = moment().format('hh:mm');
    timeElement.addEventListener('change', () => { validate(updateOutput) } )

    handleCopy(unixCopyElement, document.querySelector('#unix'))
    handleCopy(longCopyElement, document.querySelector('#long'))
    handleCopy(relativeCopyElement, document.querySelector('#relative'))

    validate(updateOutput)
})();