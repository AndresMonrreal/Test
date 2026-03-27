import {bookApi} from '$lib/api/api'
import {notification} from '$lib/stores/notification.svelte'

function createBookStore(){
    let items = $state([])
    let total = $state(0)
    let page = $state(1)
    let limit = $state(5)
    let loading = $state(false)
    let error = $state(null)

    return {
        get items() {return items },
        get total() {return total},
        get page()  {return page},
        get limit() {return limit},
        get loading() {return loading},
        get error() {return error},

        async load(p = 1 ,n = 5){
            loading = true
            error = null

            try{
                const res =  await bookApi.getAll({page:p,limit:n})

                items = res.items ?? []
                total = res.totalItems ?? 0
                page = p
                limit = n
            }catch{
                error = 'Error al cargar los libros'
            }finally{
                loading = false
            }
        },


        async create(data){
            const res = await bookApi.create(data)
            notification.show('success', 'Libro creado exitosamente')
            return res
        },

        async update(id,data){
            const res = await bookApi.update(id,data)
            notification.show('success', 'Libro actualizado exitosamente')
            await this.load(page, limit)
            return res
        },

        async remove(id){
            await bookApi.delete(id)
            notification.show('success', 'Libro eliminado exitosamente')
            await this.load(page, limit)        
           
        },
    }

}

export const books = createBookStore()

