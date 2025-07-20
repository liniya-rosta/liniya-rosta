import mongoose, {Schema, Document} from 'mongoose';

interface IImage {
    url: string;
    alt?: string | null;
}

interface ICharacteristic {
    name: string;
    value: string;
}

interface ISale {
    isOnSale: boolean;
    label?: string | null;
}

export interface IProduct extends Document {
    title: string;
    description?: string;
    category: mongoose.Types.ObjectId;
    slug: string;
    cover: IImage;
    icon?: IImage;
    images: IImage[];
    characteristics: ICharacteristic[];
    sale: ISale;
    seoTitle?: string;
    seoDescription?: string;
}

const imageSchema = new Schema<IImage>({
    url: {type: String, required: true},
    alt: {type: String, default: null},
}, {_id: false});

const characteristicSchema = new Schema<ICharacteristic>({
    name: {type: String, required: true},
    value: {type: String, required: true},
}, {_id: false});

const productSchema = new Schema<IProduct>({
    title: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    description: {type: String},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    seoTitle: {type: String, default: null},
    seoDescription: {type: String, default: null},
    cover: {type: imageSchema, required: true},
    icon: {type: imageSchema, default: null},
    images: {type: [imageSchema], default: []},
    characteristics: {type: [characteristicSchema], default: []},
    sale: {
        isOnSale: {type: Boolean, default: false},
        label: {type: String, default: null},
    },
}, {timestamps: true});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);