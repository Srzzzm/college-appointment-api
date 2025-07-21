

const request = require('supertest');

const app = require('../app'); 
const mongoose = require('mongoose');
const User = require('../src/models/user.model');

const Appointment = require('../src/models/appointment.model');


beforeAll(async () => {
    
    
    const MONGO_URI_TEST = 'mongodb://localhost:27017/college-appointment-system-test';
    await mongoose.connect(MONGO_URI_TEST);
});


afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
} );


describe('College Appointment System E2E Test', () => {
    
    let studentA1Token, studentA2Token, professorP1Token;
    let professorP1Id;

    let appointmentT1Id, appointmentT2Id;

    
    it('should register and login Professor P1', async () => {
        
        await request(app)

            .post('/api/auth/register')
            .send({ email: 'prof.p1@test.com', password: 'password123', role: 'professor' });
        
        

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'prof.p1@test.com', password: 'password123' });
        
        professorP1Token = res.body.token;
        const user = await User.findOne({ email: 'prof.p1@test.com' });
        professorP1Id = user._id; 
        
        expect(professorP1Token).toBeDefined();
    });

    
    it('should allow Professor P1 to specify availability', async () => 
        
        {
        const now = new Date();
        const timeSlots = [
            new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
            new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString()
        ];

        await request(app)
            .post('/api/professor/availability')

            .set('Authorization', `Bearer ${professorP1Token}`)
            .send({ timeSlots })
            .expect(201); 

    } );

    
    it('should register and login Student A1', async () => 
        
        {
        await request(app)
            .post('/api/auth/register')
            .send({ email: 'student.a1@test.com', password: 'password123', role: 'student' });
        
        const res = await request(app)
            .post('/api/auth/login')

            .send({ email: 'student.a1@test.com', password: 'password123' });
        
        studentA1Token = res.body.token;
        expect(studentA1Token).toBeDefined();
    });

    
    it('should allow Student A1 to view available slots for Professor P1', async () => {
        const res = await request(app)
            .get(`/api/student/availability/${professorP1Id}`)
            .set('Authorization', `Bearer ${studentA1Token}`)
            .expect(200);
        
        expect(res.body.length).toBe(2); 
        appointmentT1Id = res.body[0]._id; 
        appointmentT2Id = res.body[1]._id;
    });

    
    it('should allow Student A1 to book an appointment for time T1', async () => {
        await request(app)
            .post(`/api/student/book/${appointmentT1Id}`)
            .set('Authorization', `Bearer ${studentA1Token}`)
            .expect(200);
    });

    
    it('should register and login Student A2', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ email: 'student.a2@test.com', password: 'password123', role: 'student' });
            
        const res = await request(app)

            .post('/api/auth/login')
            .send({ email: 'student.a2@test.com', password: 'password123' });
            
        studentA2Token = res.body.token;
        expect(studentA2Token).toBeDefined();
    });

    
    it('should allow Student A2 to book an appointment for time T2', async () => 
        {
        await request(app)
            .post(`/api/student/book/${appointmentT2Id}`)
            .set('Authorization', `Bearer ${studentA2Token}`)
            .expect(200);
    });

    
    it('should allow Professor P1 to cancel the appointment with Student A1', async () => 
        {
        await request(app)
            .delete(`/api/professor/appointments/${appointmentT1Id}`)
            .set('Authorization', `Bearer ${professorP1Token}`)
            .expect(200);
    } );

    
    it('should show Student A1 that they have no pending appointments', async () => {
        const res = await request(app)
            .get('/api/student/appointments')
            .set('Authorization', `Bearer ${studentA1Token}`);
            
        expect(res.body.length).toBe(0);

   
    });

} );