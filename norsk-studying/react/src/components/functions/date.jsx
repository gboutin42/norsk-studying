export function renderDate(value) {
    if (value) {
        const date = new Date(value)
        const options = { day: 'numeric', month: 'long', year: 'numeric' };

        return date.toLocaleDateString('fr-FR', options)
    }

    return '---'
}