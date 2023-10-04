const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const multer = require('multer');
const path = require('path');
const mime = require('mime-types');
const fs = require('fs');

require('dotenv').config();

// require database connection
const db = require('./utils/database/DatabaseConnection');
// require auth
const { verifyToken } = require('./utils/auth/AuthVerify');
// require sanitize and validator
const { sanitizeAndValidate, sanitizeAndValidateArray } = require('./utils/validator and sanitizer/ValidatorAndSanitizer');

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FE_LINK,
    methods: ["POST", "GET"],
    credentials: true
}));

// initialize my secret key
const secretKey = process.env.SECRET_KEY;

// ###################################################################################################################################################################################
// #####################################################################  PROTECTED SIDE  ############################################################################################
// ###################################################################################################################################################################################
app.get('/api/protected', verifyToken, (req, res) => {
    const { user } = req;

    res.status(200).json({ message: 'Success', user: user });
});

// ###################################################################################################################################################################################
// #####################################################################  LOGIN SIDE  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const validationRules = [
        { validator: validator.isLength, options: { min: 1, max: 255 } },
    ];

    const sanitizeUsername = sanitizeAndValidate(username, validationRules);
    const sanitizePassword = sanitizeAndValidate(password, validationRules);

    if (!sanitizeUsername || !sanitizePassword) {
        res.status(401).json({ message: "Invalid Input!" });
    } else {
        // check the username
        const check = `SELECT * FROM users WHERE username = ? AND isDelete = ?`;
        db.query(check, [sanitizeUsername, "not"], (error, result) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                if (result.length > 0) {
                    // get the password
                    const dbPassword = result[0].password;

                    // check if the password is correct
                    const hashedPassword = crypto.createHash('sha256').update(sanitizePassword).digest('hex');
                    if (hashedPassword === dbPassword) {
                        // create token
                        const fetchData = {
                            id: result[0].id,
                            first_name: result[0].first_name,
                            middle_name: result[0].middle_name,
                            last_name: result[0].last_name,
                            username: result[0].username,
                            userType: result[0].user_type
                        }

                        // you can modify this to set the expiration
                        const token = jwt.sign(fetchData, secretKey);
                        // send to client
                        res.status(200).json({ message: token, userType: result[0].user_type });
                    } else {
                        res.status(401).json({ message: "Invalid Password!" });
                    }
                } else {
                    res.status(401).json({ message: "Invalid Username!" });
                }
            }
        });
    }
});

// ###################################################################################################################################################################################
// #####################################################################  FETCH USER DATA  ############################################################################################
// ###################################################################################################################################################################################

app.post('/api/fetch-user', verifyToken, (req, res) => {
    const { userId } = req.body;

    const validationRules = [
        { validator: validator.isLength, options: { min: 1, max: 50 } },
    ];

    const sanitizeUserId = sanitizeAndValidate(userId, validationRules);

    if (!sanitizeUserId) {
        res.status(401).json({ message: "Invalid Input!" });
    }
    else {
        const select = `SELECT * FROM users WHERE id = ? AND isDelete = ?`;
        db.query(select, [sanitizeUserId, "not"], (error, results) => {
            if (error) {
                res.status(401).json({ message: "server side error!" });
            } else {
                if (results.length > 0) {
                    res.status(200).json({ message: results });
                } else {
                    res.status(401).json({ message: "No user found!" });
                }
            }
        });
    }
});

// ###################################################################################################################################################################################
// #####################################################################  AUTO IMAGE UPLOAD  ############################################################################################
// ###################################################################################################################################################################################
// require uploads folder
app.use('/assets', express.static('assets'));
const imageUpload = multer({
    dest: 'assets/image uploads/',
});

app.post('/api/auto-image-upload', verifyToken, imageUpload.single('image'), (req, res) => {
    const { userId } = req.body;

    const validationRules = [
        { validator: validator.isLength, options: { min: 1, max: 50 } },
    ];

    const sanitizeUserId = sanitizeAndValidate(userId, validationRules);

    if (!sanitizeUserId) {
        res.status(401).json({ message: "Invalid Input!" });
    }
    else {
        const originalFileName = req.file.originalname;
        const uniqueFileName = `${Date.now()}_+_${originalFileName}`;
        const uniqueFilePath = `assets/image uploads/${uniqueFileName}`;

        const typeMime = mime.lookup(originalFileName);

        if ((typeMime === 'image/png') || (typeMime === 'image/jpeg')) {
            fs.rename(req.file.path, uniqueFilePath, (err) => {
                if (err) {
                    res.status(401).json({ message: "Error to upload file" });
                } else {
                    const sanitizedFileName = sanitizeHtml(req.file.originalname); // Sanitize HTML content
                    if (!validator.isLength(sanitizedFileName, { min: 1, max: 255 })) {
                        return res.status(401).send({ message: "Invalid File Name!" });
                    }
                    else {
                        const insert = `UPDATE users SET image = ? WHERE id = ?`;
                        db.query(insert, [uniqueFileName, sanitizeUserId], (error, results) => {
                            if (error) {
                                res.status(401).json({ message: "Server side error!" });
                            } else {
                                res.status(200).json({ message: "Profile image changed!" });
                            }
                        });
                    }
                }
            });
        }
        else {
            res.status(401).json({ message: "Invalid Image Type!" });
        }
    }
});

// ###################################################################################################################################################################################
// ##################################################################### CHANGE USER PASSWORD  ############################################################################################
// ###################################################################################################################################################################################

app.post('/api/change-password', verifyToken, (req, res) => {
    const { userId, password, newPassword, confirmPassword, username } = req.body;

    const validationRules = [
        { validator: validator.isLength, options: { min: 1, max: 50 } },
    ];

    const sanitizeUsername = sanitizeAndValidate(username, validationRules);
    const sanitizeUserId = sanitizeAndValidate(userId, validationRules);
    const sanitizePassword = sanitizeAndValidate(password, validationRules);
    const sanitizeNewPassword = sanitizeAndValidate(newPassword, validationRules);
    const sanitizeConfirmPassword = sanitizeAndValidate(confirmPassword, validationRules);

    if (!sanitizeUserId || !sanitizePassword || !sanitizeNewPassword || !sanitizeConfirmPassword || !sanitizeUsername) {
        res.status(401).json({ message: "Invalid Input!" });
    }
    else {
        if (sanitizeUsername.length >= 5 && sanitizeUsername.length <= 20) {
            if (sanitizeNewPassword === sanitizeConfirmPassword) {
                if (sanitizeNewPassword.length >= 7 && sanitizeNewPassword.length <= 20) {
                    // select password
                    const select = `SELECT * FROM users WHERE id = ? AND isDelete = ?`;
                    db.query(select, [sanitizeUserId, 'not'], (error, results) => {
                        if (error) {
                            res.status(401).json({ message: "Server side error!" });
                        } else {
                            if (results.length > 0) {
                                // get db password
                                const dbPassword = results[0].password;

                                // hash current password
                                const hashedPassword = crypto.createHash('sha256').update(sanitizePassword).digest('hex');
                                // hash new Password
                                const hashedNewPassword = crypto.createHash('sha256').update(sanitizeNewPassword).digest('hex');

                                // check the current password and new password
                                if (dbPassword === hashedPassword) {
                                    // update database
                                    const checkUsername = `SELECT * FROM users WHERE username = ? AND id != ?`;
                                    db.query(checkUsername, [sanitizeUsername, sanitizeUserId], (error, results) => {
                                        if (error) {
                                            res.status(401).json({ message: "Server side error!" });
                                        } else {
                                            if (results.length > 0) {
                                                res.status(401).json({ message: "Username already exist!" });
                                            } else {
                                                const update = `UPDATE users SET password = ? WHERE id = ?`;
                                                db.query(update, [hashedNewPassword, sanitizeUserId], (error, results) => {
                                                    if (error) {
                                                        res.status(401).json({ message: "Server side error!" });
                                                    } else {
                                                        res.status(200).json({ message: "Password updated successfully!" });
                                                    }
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    res.status(401).json({ message: "Invalid Current Password!" });
                                }
                            } else {
                                res.status(401).json({ message: "Something went wrong!" });
                            }
                        }
                    });
                } else {
                    res.status(401).json({ message: "New password must have 7 to 20 characters!" });
                }
            } else {
                res.status(401).json({ message: "New password and confirm password not match!" });
            }
        } else {
            res.status(401).json({ message: "Username must have 5 to 20 characters!" });
        }
    }
});

// ###################################################################################################################################################################################
// ##################################################################### ADD STAFF ACCOUNT  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/add-staff-account', verifyToken, (req, res) => {
    const { addStaffAccount, password, userId } = req.body;

    if (password.length >= 7 && password.length <= 20) {
        if (addStaffAccount.firstName && addStaffAccount.middleName && addStaffAccount.lastName && addStaffAccount.username && password) {
            if (addStaffAccount.username.length >= 5 && addStaffAccount.username.length <= 20) {
                const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

                // check username if already exist
                const check = `SELECT * FROM users WHERE username = ?`;
                db.query(check, [addStaffAccount.username], (error, results) => {
                    if (error) {
                        res.status(401).json({ message: "Server side error!" });
                    } else {
                        if (results.length > 0) {
                            res.status(401).json({ message: "Username already exist!" });
                        } else {
                            const add = `INSERT INTO users (first_name, middle_name, last_name, username, password, user_type) VALUES (?, ?, ?, ?, ?, ?)`;
                            db.query(add, [addStaffAccount.firstName, addStaffAccount.middleName, addStaffAccount.lastName, addStaffAccount.username, hashedPassword, "Staff"], (error, results) => {
                                if (error) {
                                    res.status(401).json({ message: "Server side error!" });
                                } else {
                                    // console.log(results.insertId);
                                    // insert notification
                                    const insert = `INSERT INTO notifications (user_id, notification_type, content) VALUES (?, ?, ?)`;
                                    db.query(insert, [userId, "Add staff account", `You added ${addStaffAccount.firstName} ${addStaffAccount.middleName} ${addStaffAccount.lastName} as Staff.`], (error, results) => {
                                        if (error) {
                                            res.status(401).json({ message: "Server side error!" });
                                        } else {
                                            res.status(200).json({ message: `You've successfully added ${addStaffAccount.firstName} ${addStaffAccount.middleName[0].toUpperCase()}. ${addStaffAccount.lastName}!` })
                                        }
                                    })
                                }
                            });
                        }
                    }
                });
            } else {
                res.status(401).json({ message: "Username must have 5 to 20 characters!" });
            }
        } else {
            res.status(401).json({ message: "Invalid Input!" });
        }
    } else {
        res.status(401).json({ message: "Password must have 7 to 20 characters!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### FETCH ALL USERS  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/fetch-all-users', verifyToken, (req, res) => {
    const { userType } = req.body;

    const select = `SELECT * FROM users WHERE user_type = ? AND isDelete = ?`;
    db.query(select, [userType, "not"], (error, results) => {
        if (error) {
            res.status(401).json({ message: "Server side error!" });
        } else {
            res.status(200).json({ message: results });
        }
    });
});

// ###################################################################################################################################################################################
// ##################################################################### UPDATE ACCOUNTS  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/update-staff-account', verifyToken, (req, res) => {
    const { updateStaffAccount, userId } = req.body;

    if (updateStaffAccount.firstName && updateStaffAccount.middleName && updateStaffAccount.lastName && updateStaffAccount.username) {
        if (updateStaffAccount.username.length >= 5 && updateStaffAccount.username.length <= 20) {

            // check username if already exist
            const check = `SELECT * FROM users WHERE username = ? AND id != ?`;
            db.query(check, [updateStaffAccount.username, userId], (error, results) => {
                if (error) {
                    res.status(401).json({ message: "Server side error!" });
                } else {
                    if (results.length > 0) {
                        res.status(401).json({ message: "Username already exist!" });
                    } else {
                        const update = `UPDATE users SET first_name = ?, middle_name = ?, last_name = ?, username = ? WHERE id = ?`;
                        db.query(update, [updateStaffAccount.firstName, updateStaffAccount.middleName, updateStaffAccount.lastName, updateStaffAccount.username, userId], (error, results) => {
                            if (error) {
                                res.status(401).json({ message: "Server side error!" });
                            } else {
                                res.status(200).json({ message: "Account successfully updated!" });
                            }
                        });
                    }
                }
            });
        } else {
            res.status(401).json({ message: "Username must have 5 to 20 characters!" });
        }
    } else {
        res.status(401).json({ message: "Invalid Input!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### DELETE ACCOUNT  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/delete-account', verifyToken, (req, res) => {
    const { userId } = req.body;

    const isdelete = `UPDATE users SET isDelete = ? WHERE id = ?`;
    db.query(isdelete, ["Deleted", userId], (error, results) => {
        if (error) {
            res.status(401).json({ message: "Server side error!" });
        } else {
            res.status(200).json({ message: "Deleted Successfully!" });
        }
    });
});

// ###################################################################################################################################################################################
// ##################################################################### ADD STUDENT INFO AND ACCOUNT  ###############################################################################
// ###################################################################################################################################################################################
app.post('/api/add-new-student', verifyToken, (req, res) => {
    const { studentInfo, userId } = req.body;

    if (studentInfo.LRN && studentInfo.firstName && studentInfo.middleName && studentInfo.lastName && studentInfo.gender && studentInfo.civilStatus && studentInfo.phoneNumber && studentInfo.religion && studentInfo.birthPlace && studentInfo.address && studentInfo.dateOfBirth && studentInfo.parentOrGuardian && studentInfo.curriculumn && studentInfo.teacher && studentInfo.grade && studentInfo.SY && userId) {
        // check the LRN
        const check = `SELECT * FROM user_info WHERE lrn = ? AND isDelete = ?`;
        db.query(check, [studentInfo.LRN, "not"], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                if (results.length > 0) {
                    res.status(401).json({ message: "LRN already exist!" });
                } else {
                    // insert user account
                    const userHashedPassword = crypto.createHash('sha256').update(studentInfo.lastName).digest('hex');
                    const insertAccount = `INSERT INTO users (username, password, first_name, middle_name, last_name, user_type) VALUES (?,?,?,?,?,?)`;
                    db.query(insertAccount, [studentInfo.LRN, userHashedPassword, studentInfo.firstName, studentInfo.middleName, studentInfo.lastName, "Student"], (error, results) => {
                        if (error) {
                            res.status(401).json({ message: "Server side errors" });
                        } else {
                            // get the inserted id
                            const insertId = results.insertId;
                            const insert = `INSERT INTO user_info (user_id, lrn, first_name, middle_name, last_name, gender, civil_status, phone_number, religion, birth_place, address, date_of_birth, parent_guardian, curriculumn, teacher_id, grade, school_year) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                            db.query(insert, [insertId, studentInfo.LRN, studentInfo.firstName, studentInfo.middleName, studentInfo.lastName, studentInfo.gender, studentInfo.civilStatus, studentInfo.phoneNumber, studentInfo.religion, studentInfo.birthPlace, studentInfo.address, studentInfo.dateOfBirth, studentInfo.parentOrGuardian, studentInfo.curriculumn, studentInfo.teacher, studentInfo.grade, studentInfo.SY], (error, results) => {
                                if (error) {
                                    res.status(401).json({ message: "Server side error!" });
                                } else {
                                    // notification here
                                    const insertNotification = `INSERT INTO notifications (user_id, notification_type, content) VALUES (?, ?, ?)`;
                                    db.query(insertNotification, [userId, "Add new student", `You added ${studentInfo.firstName} ${studentInfo.middleName} ${studentInfo.lastName} as new student`], (error, results) => {
                                        if (error) {
                                            res.status(401).json({ message: "Server side error" });
                                        } else {
                                            // insert notification for adding student account
                                            const insertStudentAccount = `INSERT INTO notifications (user_id, notification_type, content) VALUES (?, ?, ?)`;
                                            db.query(insertStudentAccount, [userId, "Add student account", `You added ${studentInfo.firstName} ${studentInfo.middleName} ${studentInfo.lastName} as student account`], (error, results) => {
                                                if (error) {
                                                    res.status(401).json({ message: "Server side error" });
                                                } else {
                                                    res.status(200).json({ message: "New student successfully added" });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        res.status(401).json({ message: "Invalid Input!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### UPDATE STUDENT INFO  ###############################################################################
// ###################################################################################################################################################################################
app.post('/api/update-new-student', verifyToken, (req, res) => {
    const { updateStudentInfo, updateId } = req.body;

    if (updateStudentInfo.LRN && updateStudentInfo.firstName && updateStudentInfo.middleName && updateStudentInfo.lastName && updateStudentInfo.gender && updateStudentInfo.civilStatus && updateStudentInfo.phoneNumber && updateStudentInfo.religion && updateStudentInfo.birthPlace && updateStudentInfo.address && updateStudentInfo.dateOfBirth && updateStudentInfo.parentOrGuardian && updateStudentInfo.curriculumn && updateStudentInfo.teacher && updateStudentInfo.SY && updateStudentInfo.grade && updateId) {
        // check the LRN
        const check = `SELECT * FROM user_info WHERE lrn = ? AND isDelete = ? AND id != ?`;
        db.query(check, [updateStudentInfo.LRN, "not", updateId], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                if (results.length > 0) {
                    res.status(401).json({ message: "LRN already exist!" });
                } else {
                    // update user info
                    const updates = `UPDATE user_info SET lrn = ?, first_name = ?, middle_name = ?, last_name = ?, gender = ?, civil_status = ?, phone_number = ?, religion = ?, birth_place = ?, address = ?, date_of_birth = ?, parent_guardian = ?, curriculumn = ?, teacher_id = ?, grade = ?, school_year = ? WHERE id = ?`;
                    db.query(updates, [updateStudentInfo.LRN, updateStudentInfo.firstName, updateStudentInfo.middleName, updateStudentInfo.lastName, updateStudentInfo.gender, updateStudentInfo.civilStatus, updateStudentInfo.phoneNumber, updateStudentInfo.religion, updateStudentInfo.birthPlace, updateStudentInfo.address, updateStudentInfo.dateOfBirth, updateStudentInfo.parentOrGuardian, updateStudentInfo.curriculumn, updateStudentInfo.teacher, updateStudentInfo.grade, updateStudentInfo.SY, updateId], (error, results) => {
                        if (error) {
                            res.status(401).json({ message: "Server side error!" });
                        } else {
                            res.status(200).json({ message: "Student info updated successfully!" });
                        }
                    });
                }
            }
        });
    } else {
        res.status(401).json({ message: "Invalid Input!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### DELETE STUDENT INFO AND ACCOUNT  ###############################################################################
// ###################################################################################################################################################################################
app.post('/api/delete-student-info', verifyToken, (req, res) => {
    const { deleteId } = req.body;

    if (deleteId) {
        const deleteStudentInfo = `UPDATE user_info SET isDelete = ? WHERE id = ?`;
        db.query(deleteStudentInfo, ["Deleted", deleteId], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                res.status(200).json({ message: "Successfully deleted!" });
            }
        });
    } else {
        res.status(401).json({ message: "Something went wrong!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### FETCH ALL USER INFORMATION  ###############################################################################
// ###################################################################################################################################################################################
app.get('/api/fetch-users-info', verifyToken, (req, res) => {

    const select = `SELECT * FROM user_info WHERE isDelete = ?`;
    db.query(select, ["not"], (error, results) => {
        if (error) {
            res.status(401).json({ message: "Server side error!" });
        } else {
            res.status(200).json({ message: results });
        }
    });
});

// ###################################################################################################################################################################################
// ##################################################################### ADD SUBJECT  ###############################################################################
// ###################################################################################################################################################################################
app.post('/api/add-subject', verifyToken, (req, res) => {
    const { addSubject, userId } = req.body;

    if (addSubject.subject && addSubject.applicableFor) {
        // CHECK SUBJECT
        const check = `SELECT * FROM subjects WHERE subject = ? AND isDelete = ?`;
        db.query(check, [addSubject.subject, "not"], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                if (results.length > 0) {
                    res.status(401).json({ message: "Subject already exist!" });
                } else {
                    // insert subject
                    const insert = `INSERT INTO subjects (subject, applicable_for, description) VALUES (?, ?, ?)`;
                    db.query(insert, [addSubject.subject, addSubject.applicableFor, addSubject.description], (error, results) => {
                        if (error) {
                            res.status(401).json({ message: "Server side error!" });
                        } else {
                            // insert notification
                            const insertNotification = `INSERT INTO notifications (user_id, notification_type, content) VALUES (?,?,?)`;
                            db.query(insertNotification, [userId, "Add subject", `You added new ${addSubject.subject} subject`], (error, results) => {
                                if (error) {
                                    res.status(401).json({ message: "server side error!" });
                                } else {
                                    // success
                                    res.status(200).json({ message: `${addSubject.subject} successfully added!` });
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        res.status(401).json({ message: "Invalid Input!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### FETCH ALL SUBJECT  ###############################################################################
// ###################################################################################################################################################################################
app.get('/api/fetch-all-subject', verifyToken, (req, res) => {

    const getSubject = `SELECT * FROM subjects WHERE isDelete = ?`;
    db.query(getSubject, ["not"], (error, results) => {
        if (error) {
            res.status(401).json({ message: "Server side error!" });
        } else {
            if (results.length > 0) {
                res.status(200).json({ message: results });
            } else {
                res.status(401).json({ message: "No subject" });
            }
        }
    });
});

// ###################################################################################################################################################################################
// ##################################################################### UPDATE SUBJECT  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/update-subject', verifyToken, (req, res) => {
    const { updateSubject, updateId } = req.body;

    if (updateSubject.subject && updateSubject.applicableFor) {
        // check subject
        const checkSubject = `SELECT * FROM subjects WHERE isDelete = ? AND subject = ? AND id != ?`;
        db.query(checkSubject, ["not", updateSubject.subject, updateId], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                if (results.length > 0) {
                    res.status(401).json({ message: "Subject already exist!" });
                } else {
                    // update subject
                    const toUpdate = `UPDATE subjects SET subject = ?, applicable_for = ?, description = ? WHERE id = ?`;
                    db.query(toUpdate, [updateSubject.subject, updateSubject.applicableFor, updateSubject.description, updateId], (error, results) => {
                        if (error) {
                            res.status(401).json({ message: "Server side error!" });
                        } else {
                            res.status(200).json({ message: "Subject successfully updated!" });
                        }
                    });
                }
            }
        });
    } else {
        res.status(401).json({ message: "Invalid Input!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### DELETE SUBJECT  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/delete-subject', verifyToken, (req, res) => {
    const { updateId } = req.body;

    if (updateId) {
        // update
        const update = `UPDATE subjects SET isDelete = ? WHERE id = ?`;
        db.query(update, ["Deleted", updateId], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                res.status(200).json({ message: "Subject successfully deleted!" });
            }
        });
    } else {
        res.status(401).json({ message: "Something went wrong!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### FETCH ALL SCHOOL YEAR  ###############################################################################
// ###################################################################################################################################################################################
app.get('/api/fetch-all-school-year', verifyToken, (req, res) => {

    const getSY = `SELECT * FROM school_year WHERE isDelete = ?`;
    db.query(getSY, ["not"], (error, results) => {
        if (error) {
            res.status(401).json({ message: "Server side error!" });
        } else {
            if (results.length > 0) {
                res.status(200).json({ message: results });
            } else {
                res.status(401).json({ message: "No school year found" });
            }
        }
    });
});

// ###################################################################################################################################################################################
// ##################################################################### ADD SCHOOL YEAR  ###############################################################################
// ###################################################################################################################################################################################
app.post('/api/add-school-year', verifyToken, (req, res) => {
    const { addSchoolYear, userId } = req.body;

    if (addSchoolYear.SY && addSchoolYear.current) {
        // CHECK school year
        const check = `SELECT * FROM school_year WHERE school_year = ? AND isDelete = ?`;
        db.query(check, [addSchoolYear.SY, "not"], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                if (results.length > 0) {
                    res.status(401).json({ message: "School year already exist!" });
                } else {
                    // insert school year
                    const insert = `INSERT INTO school_year (school_year, current) VALUES (?, ?)`;
                    db.query(insert, [addSchoolYear.SY, addSchoolYear.current], (error, results) => {
                        if (error) {
                            res.status(401).json({ message: "Server side error!" });
                        } else {
                            // insert notification
                            const insertNotification = `INSERT INTO notifications (user_id, notification_type, content) VALUES (?,?,?)`;
                            db.query(insertNotification, [userId, "Add school year", `You added new school year ${addSchoolYear.SY}`], (error, results) => {
                                if (error) {
                                    res.status(401).json({ message: "server side error!" });
                                } else {
                                    // success
                                    res.status(200).json({ message: `${addSchoolYear.SY} successfully added!` });
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        res.status(401).json({ message: "Invalid Input!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### UPDATE SCHOOL YEAR  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/update-school-year', verifyToken, (req, res) => {
    const { updateSchoolYear, updateId } = req.body;

    if (updateSchoolYear.SY && updateSchoolYear.current) {
        // check school year
        const checkSubject = `SELECT * FROM school_year WHERE isDelete = ? AND school_year = ? AND id != ?`;
        db.query(checkSubject, ["not", updateSchoolYear.SY, updateId], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                if (results.length > 0) {
                    res.status(401).json({ message: "School year already exist!" });
                } else {
                    // update school year
                    const toUpdate = `UPDATE school_year SET school_year = ?, current = ? WHERE id = ?`;
                    db.query(toUpdate, [updateSchoolYear.SY, updateSchoolYear.current, updateId], (error, results) => {
                        if (error) {
                            res.status(401).json({ message: "Server side error!" });
                        } else {
                            res.status(200).json({ message: "School year successfully updated!" });
                        }
                    });
                }
            }
        });
    } else {
        res.status(401).json({ message: "Invalid Input!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### DELETE SCHOOL YEAR  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/delete-school-year', verifyToken, (req, res) => {
    const { updateId } = req.body;

    if (updateId) {
        // update
        const update = `UPDATE school_year SET isDelete = ? WHERE id = ?`;
        db.query(update, ["Deleted", updateId], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                res.status(200).json({ message: "School year successfully deleted!" });
            }
        });
    } else {
        res.status(401).json({ message: "Something went wrong!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### FETCH ALL GRADE  ###############################################################################
// ###################################################################################################################################################################################
app.get('/api/fetch-all-grade', verifyToken, (req, res) => {

    const getSY = `SELECT * FROM grade_list WHERE isDelete = ?`;
    db.query(getSY, ["not"], (error, results) => {
        if (error) {
            res.status(401).json({ message: "Server side error!" });
        } else {
            if (results.length > 0) {
                res.status(200).json({ message: results });
            } else {
                res.status(401).json({ message: "No grade found" });
            }
        }
    });
});

// ###################################################################################################################################################################################
// ##################################################################### ADD GRADE  ###############################################################################
// ###################################################################################################################################################################################
app.post('/api/add-grade', verifyToken, (req, res) => {
    const { addGradeList, userId } = req.body;

    if (addGradeList && userId) {
        // CHECK Grade
        const check = `SELECT * FROM grade_list WHERE grade = ? AND isDelete = ?`;
        db.query(check, [addGradeList, "not"], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                if (results.length > 0) {
                    res.status(401).json({ message: "Grade already exist!" });
                } else {
                    // insert Grade
                    const insert = `INSERT INTO grade_list (grade) VALUES (?)`;
                    db.query(insert, [addGradeList], (error, results) => {
                        if (error) {
                            res.status(401).json({ message: "Server side error!" });
                        } else {
                            // insert notification
                            const insertNotification = `INSERT INTO notifications (user_id, notification_type, content) VALUES (?,?,?)`;
                            db.query(insertNotification, [userId, "Add grade", `You added new grade ${addGradeList}`], (error, results) => {
                                if (error) {
                                    res.status(401).json({ message: "server side error!" });
                                } else {
                                    // success
                                    res.status(200).json({ message: `${addGradeList} successfully added!` });
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        res.status(401).json({ message: "Invalid Input!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### UPDATE GRADE  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/update-grade', verifyToken, (req, res) => {
    const { updateGradeList, updateId } = req.body;

    if (updateGradeList && updateId) {
        // check Grade
        const checkSubject = `SELECT * FROM grade_list WHERE isDelete = ? AND grade = ? AND id != ?`;
        db.query(checkSubject, ["not", updateGradeList, updateId], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                if (results.length > 0) {
                    res.status(401).json({ message: "Grade already exist!" });
                } else {
                    // update Grade
                    const toUpdate = `UPDATE grade_list SET grade = ? WHERE id = ?`;
                    db.query(toUpdate, [updateGradeList, updateId], (error, results) => {
                        if (error) {
                            res.status(401).json({ message: "Server side error!" });
                        } else {
                            res.status(200).json({ message: "Grade successfully updated!" });
                        }
                    });
                }
            }
        });
    } else {
        res.status(401).json({ message: "Invalid Input!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### DELETE GRADE  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/delete-grade', verifyToken, (req, res) => {
    const { updateId } = req.body;

    if (updateId) {
        // update
        const update = `UPDATE grade_list SET isDelete = ? WHERE id = ?`;
        db.query(update, ["Deleted", updateId], (error, results) => {
            if (error) {
                res.status(401).json({ message: "Server side error!" });
            } else {
                res.status(200).json({ message: "Grade successfully deleted!" });
            }
        });
    } else {
        res.status(401).json({ message: "Something went wrong!" });
    }
});

// ###################################################################################################################################################################################
// ##################################################################### GET NOTIFICATION GRADE  ############################################################################################
// ###################################################################################################################################################################################
app.post('/api/notification', verifyToken, (req, res) => {
    const {userId} = req.body;

    if (userId){
        const select = `SELECT * FROM notifications WHERE user_id = ? AND isDelete = ?`;
        db.query(select, [userId, "not"], (error, results) => {
            if (error) {
                res.status(401).json({message: "Server side error!"});
            }else{
                if (results.length > 0){
                    res.status(200).json({message: results});
                }else{
                    res.status(401).json({message: "No notification"});
                }
            }
        })
    }else{
        res.status(401).json({message: "Invalid Input!"});
    }
});


app.listen(process.env.DB_PORT, () => {
    console.log(`Server running on port ${process.env.DB_PORT}`);
});
