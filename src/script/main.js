// done
const [x, y] = [1, 2]
console.log('done')

$('.wrapper').on('click', function () {
    import(/* webpackChunkName: 'another' */ './another.js').then(module => {
        let append = module.default
        append()
    })
})

console.log(_.sum([321, 3, 2, 1, 321]))
