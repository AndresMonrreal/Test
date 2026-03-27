import { authorApi } from "$lib/api/api"
import { notification } from "./notification.svelte"

function createAuthorStore(){
    let items = $state([]) //Lista de autores
    let total = $state(0)   //Para manejar la paginación y la cantidad total
    let page = $state(1)    //Pagina actual 
    let limit = $state(5)   //Cantidad de autores por pagina
    let loading = $state(false) //Indica si se esta cargando una peticion de la api
    let error = $state(null)    //Para manejar errores de la api

    return {

        // Estos get permiten leer las variables pero no modificarlas directamente 
        // desde afuera, protegiendo la integridad del estado.
        get items() {return items},
        get total() {return total},
        get page() {return page},
        get limit() {return limit},
        get loading() {return loading},
        get error() {return error},

        //Sirve para cargar los autores desde la api, con paginación. Actualiza el estado de loading y error
        async load(n = 1, l = 5){
            loading = true  //Indica el inicio de una carga
            error = null    //Para limpiar errores anteriores

            try{
                //Llama a la api pidiendo una pagina n y un limite l de autores
                const res = await authorApi.getAll({page:n, limit:l})
                items = res.items ?? [] //Guarda los autores recibidos
                total = res.totalItems ?? 0 //Actualiza el total de autores para manejar la paginación
                page = n        //Actualiza la pagina actual
                limit = l       //Actualiza el limite de autores por pagina
            }catch{
                error = 'Failed to load authors' //Si la api falla guarda el error
            }finally{
                loading = false //Apunta el fin de la carga, sin importar si fue exitosa o no
            }
        },

        async create(data){
            const res = await authorApi.create(data) //Le pasamos el nuevo autor a la api para que lo cree
            notification.show('Author created successfully', 'success')
            return res
        },

        async update (id,data){
            const res = await authorApi.update(id,data) //Actualiza el autor con el id dado usando los nuevos datos
            notification.show('Author updated successfully', 'success')
            await this.load(page, limit) //Refresca la lista de autores para mostrar los cambios
            return res
        },

        async remove(id){
            await authorApi.delete(id) //Elimina el autor con el id dado
            notification.show('Author deleted successfully', 'success')
            await this.load(page, limit); //Refresca la lista de autores para mostrar los cambios
            
        },

        async loadAll(){
            try {
                //Hace una peticion para saber cuantos autores hay en total y cuantas paginas se necesitan para cargarlos todos
                const first = await authorApi.getAll({ page: 1, limit: 5 })
                const total = first.totalItems ?? 0 //Total de autores, para calcular cuantas paginas se necesitan
                const pages = Math.ceil(total / 5) //Calcula el numero de paginas necesarias para cargar todos los autores
        
                const requests = []
                
                for(let i = 1; i <= pages; i++){
                    //Crea una peticion para cada pagina necesaria para cargar todos los autores y las guarda en un array
                    requests.push(authorApi.getAll({ page: i, limit: 5 }))
                }
                const results = await Promise.all(requests) //Ejecuta todas las peticiones en paralelo y espera a que terminen
                items = results.flatMap(r => r.items ?? []) //Une todos los autores recibidos en un solo array y lo guarda en el estado
            }catch (err) {
                console.error("Error cargando todos los autores", err);
            }
        },
    }
}

export const authors = createAuthorStore()
