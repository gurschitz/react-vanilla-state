document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#button')
    const counter = document.querySelector('#counter')

    if (button && counter) {
        button.addEventListener('click', () => {
            window.atoms.counter.set((current) => current + 1)
        })

        window.atoms.counter.subscribe((value) => {
            counter.innerHTML = `${value}`
        })
    }
})
