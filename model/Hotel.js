import mongoose, {Schema} from 'mongoose';

export default mongoose.model('Hotel', new Schema({
    name: String,
    image: String,
    stars: Number,
    price: Number,
    region: {
      latitude: Number,
      longitude: Number,
      latitudeDelta: Number,
      longitudeDelta: Number,
    }
}));