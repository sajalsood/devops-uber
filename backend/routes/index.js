const userService = require("../services/user-service");
const busService = require("../services/bus-service");
const bookingService = require("../services/booking-service");

const routes = {
  login: {}, 
  buses: {},
  booking: {},
  bookings: {}
};
// route for login 
routes.login = async(req, res) => {
  const { user_name, password } = req.body;

  if(!user_name || !user_name.trim() || !password || !password.trim()) {
    api(res)({status: 400, message: 'Invalid Username or Password' });
    return;
  }

  let user = await userService.getUser(user_name, password);

  if(!user) {
    user = await userService.addUser({user_name, password});
  }

  api(res)({ data: user });

};
//route to get all buses
routes.buses = async(req, res) => {
  let buses = await busService.getBuses();
  api(res)({ data: buses });
};
//route to add all bookings
routes.booking = async(req, res) => {
  const req_booking = req.body;
  let booking = await bookingService.addBooking(req_booking);
  api(res)({ data: booking });
};
//route to get based on user_id
routes.bookings = async(req, res) => {
  const user_id = req.params.user_id;
  let bookings = await bookingService.getUserBookings(user_id);
  api(res)({ data: bookings });
};

const api = (res) => {
  return ({ message, status, data }={}) => {
    if(!message && !data) {
      data = 'OK';
    }
    res.status(status || 200).json({ message, data });
  };
};

module.exports = routes;
