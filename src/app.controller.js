import authController from './modules/auth/auth.controller.js'
import connectDB from './DB/connection.js'
import userController from './modules/user/user.controller.js';
import applicationController from './modules/jobs/application.controller.js';

import { globalErrorHandling } from './utils/response/error.response.js';
import cron from 'node-cron';
import * as dbService from './DB/db.service.js';


const bootstrap = (app, express) => {
    app.use(express.json())

    app.get('/', (req, res, next) => {
        return res.status(200).json({ message: "Welcome in node.js project by express" })
    })

    app.use("/auth", authController)
    app.use("/user", userController);
    app.use("/applications", applicationController); 



    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: 'In-valid routing' })
    })

    app.use(globalErrorHandling)
    connectDB()

    cron.schedule('0 */6 * * *', async () => {
        const currentTime = new Date();
        await dbService.deleteMany({
            model: userModel,
            filter: {
                $or: [
                    { confirmEmailOTPExpires: { $lt: currentTime } },
                    { resetPasswordOTPExpires: { $lt: currentTime } }
                ]
            }
        });
        console.log('Expired OTPs deleted successfully');
    });
}

export default bootstrap
