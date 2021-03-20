import express , {Application} from "express"
import path from "path"
import db from "../db/db";
import cors  from "cors"

import auhtRoutes from "../routes/auth"
import colorRoutes from "../routes/color"
import brandRoutes from "../routes/brand"
import categoryRoutes from "../routes/category"
import customerRoutes from "../routes/customer"
import modelRoutes from "../routes/clotheModel"
import sizeRoutes from "../routes/size"
import userRoutes from "../routes/user"
import wholesellerRoutes from "../routes/wholeseller"
import clotheRoutes from "../routes/clothe"
import pictureRoutes from "../routes/clothePicture"
import saleRoutes from '../routes/sale'
import saleDetailRoutes from '../routes/saleDetail'
import purchaseRoutes from '../routes/purchase'
import purchaseDetailRoutes from '../routes/purchaseDetail'
class Server {

    private app: Application;
    private port: String;
    private apiPaths = {
        auth: '/api/auth',
        brand: '/api/brand',
        category: '/api/category',
        color: '/api/color',
        customer: '/api/customer',
        model: '/api/model',
        clothe: '/api/clothe',
        clothePicture: '/api/picture',
        size: '/api/size',
        user: '/api/user',
        wholeseller: '/api/wholeseller',
        purchase: '/api/purchase',
        purchaseDetail:'/api/purchase/detail',
        sale: '/api/sale',
        saleDetail: '/api/sale/detail'
    };
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT || '8000';

        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection (){
        try {
           await db();
        } catch (error) {
            throw new Error(error);
        }
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //BODY PARSER
        this.app.use(express.json());

        //CARPETA PUBLICA
        this.app.use(express.static('public'));
        this.app.use('/public',express.static(path.resolve('public')));

    }

    routes(){
        this.app.use(this.apiPaths.auth,auhtRoutes);
        this.app.use(this.apiPaths.brand,brandRoutes);
        this.app.use(this.apiPaths.category,categoryRoutes);
        this.app.use(this.apiPaths.color,colorRoutes);
        this.app.use(this.apiPaths.customer,customerRoutes);
        this.app.use(this.apiPaths.model,modelRoutes);
        this.app.use(this.apiPaths.size,sizeRoutes);
        this.app.use(this.apiPaths.user,userRoutes);
        this.app.use(this.apiPaths.wholeseller,wholesellerRoutes);
        this.app.use(this.apiPaths.clothe,clotheRoutes);
        this.app.use(this.apiPaths.clothePicture,pictureRoutes);
        this.app.use(this.apiPaths.sale,saleRoutes);
        this.app.use(this.apiPaths.saleDetail,saleDetailRoutes);
        this.app.use(this.apiPaths.purchase,purchaseRoutes);
        this.app.use(this.apiPaths.purchaseDetail,purchaseDetailRoutes);
    }


    listen(){
        this.app.listen(this.port,()=>{
            console.log('Servidor corriendo en puerto '+ this.port);
        });
    }

}

export default Server;