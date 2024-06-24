const mongoose = require('mongoose');

// Define schema for teacher-student relationship
const teacherStudentSchema = new mongoose.Schema({
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        
    }]
});

// Create a model for teacher-student relationship
const TeacherStudent = mongoose.model('TeacherStudent', teacherStudentSchema);

module.exports = TeacherStudent;
