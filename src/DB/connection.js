import mongoose from "mongoose";

const connectDB = async () => {

    await mongoose.connect('mongodb://127.0.0.1:27017/jobs')
        .then(res => console.log('DB connected'))
        .catch(err => console.error('fail to connect on DB', err));
}
export default connectDB