const express = require("express");
const router = express.Router();
const passport = require("passport");
const authenticateToken = require("../authenticateToken");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

router.get("/test", (req, res) => {
  res.json({ message: "this is a prototype" });
});

router.get("/user", authenticateToken, (req, res) => {
  res.json({
    username: req.user.username,
    _id: req.user._id,
    lightTheme: req.user.lightTheme,
  });
});

router.get("/user/theme", authenticateToken, (req, res, next) => {
  User.findById(req.user._id).exec((err, user) => {
    if (err) {
      return next(err);
    }
    return res.json({ lightTheme: user.lightTheme });
  });
});

router.get("/user/switch-theme", authenticateToken, (req, res, next) => {
  User.findById(req.user._id).exec((err, user) => {
    User.findByIdAndUpdate(user._id, {
      lightTheme: !user.lightTheme,
    }).exec((err, result) => {
      if (err) {
        return next(err);
      }
      return res.json(result);
    });
  });
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      return res.json({
        message: "Invalid credentials",
      });
    }
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      const accessToken = jwt.sign(
        JSON.parse(JSON.stringify(user)),
        process.env.ACCESS_TOKEN_SECRET,
      );
      return res.json({
        accessToken,
      });
    });
  })(req, res, next);
});

router.post("/signup", [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username is required")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .escape(),
  body("confirm-password")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match")
    .escape(),
  (req, res, next) => {
    var errors = validationResult(req);
    var errorsArray = errors.array().map((error) => error.msg);

    User.findOne({ username: req.body.username }).exec((err, result) => {
      if (err) {
        return next(err);
      }
      if (result) {
        errorsArray.push("Username must be unique");
      }

      if (errorsArray.length > 0) {
        return res.json({
          errors: errorsArray,
        });
      }

      // passed validation
      bcrypt.hash(req.body.password, 10, (err, hashedPass) => {
        if (err) {
          return next(err);
        }
        const user = new User({
          username: req.body.username,
          password: hashedPass,
        });
        user.save((err) => {
          if (err) {
            return next(err);
          }
          req.login(user, (err) => {
            if (err) {
              return next(err);
            }
            const accessToken = jwt.sign(
              { _id: user._id, username: user.username },
              process.env.ACCESS_TOKEN_SECRET,
            );
            res.json({ accessToken });
          });
        });
      });
    });
  },
]);

router.delete("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.cookie("isAuthenticated", false);
    res.json({ message: "Logged out successfully" });
  });
});

router.post("/project/add", authenticateToken, [
  body("name").trim(),
  (req, res, next) => {
    const project = new Project({
      name: req.body.name,
      user: req.user._id,
    });

    project.save((err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: "project added successfully" });
    });
  },
]);

router.get("/projects", authenticateToken, (req, res, next) => {
  Project.find({ user: req.user._id }).exec((err, result) => {
    if (err) {
      return next(err);
    }
    return res.json({ projects: result });
  });
});

router.post("/project/edit", authenticateToken, [
  body("projectname").trim(),
  (req, res, next) => {
    Project.findByIdAndUpdate(
      req.body.id,
      { name: req.body.projectname },
      (err, project) => {
        if (err) {
          return next(err);
        }
        return res.json({
          project: { id: project._id, name: req.body.projectname },
        });
      },
    );
  },
]);

router.post("/project/delete", authenticateToken, (req, res, next) => {
  Project.findByIdAndDelete(req.body.id, null, (err, doc) => {
    if (err) {
      return next(err);
    }
    return res.json({ project: doc });
  });
});

router.post("/task/edit/:taskId", authenticateToken, (req, res, next) => {
  Task.findByIdAndUpdate(
    req.params.taskId,
    {
      name: req.body.name,
      description: req.body.description,
      dueDate: req.body.dueDate,
      repeat: req.body.repeat,
    },
    (err, task) => {
      if (err) {
        return next(err);
      }
      return res.json({ task });
    },
  );
});

router.get("/task/deactivate/:taskId", authenticateToken, (req, res, next) => {
  Task.findByIdAndUpdate(
    req.params.taskId,
    { active: false, lastCompleted: Date.now() },
    (err, task) => {
      if (err) {
        return next(err);
      }
      return res.json({ task });
    },
  );
});

router.get("/task/delete/:taskId", authenticateToken, (req, res, next) => {
  Task.findByIdAndDelete(req.params.taskId, null, (err, task) => {
    if (err) {
      return next(err);
    }
    return res.json({ task });
  });
});

router.get("/tasks/reactivate", authenticateToken, (req, res, next) => {
  Task.find({ active: false }).exec((err, tasks) => {
    if (err) {
      return next(err);
    }
    tasks.map((task) => {
      if (
        new Date().setHours(0, 0, 0, 0) >
        task.lastCompleted.setHours(0, 0, 0, 0)
      ) {
        Task.findByIdAndUpdate(task._id, { active: true }, (err) => {
          if (err) {
            return next(err);
          }
        });
      }
    });
    res.json({ tasks });
  });
});

router.get("/tasks/:projectId", authenticateToken, (req, res, next) => {
  if (req.params.projectId === "0") {
    async.parallel(
      {
        nullDueDate(cb) {
          Task.find({ dueDate: null, active: true, user: req.user._id }).exec(
            cb,
          );
        },
        isDueDate(cb) {
          Task.find({
            dueDate: { $ne: null },
            user: req.user._id,
            active: true,
          })
            .sort({ dueDate: 1 })
            .exec(cb);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        let tasks = results.nullDueDate.concat(results.isDueDate);
        tasks = tasks.map((task) => task.toObject({ virtuals: true }));
        res.json({ tasks });
      },
    );
  } else {
    async.parallel(
      {
        nullDueDate(cb) {
          Task.find({
            project: req.params.projectId,
            dueDate: null,
            active: true,
          }).exec(cb);
        },
        isDueDate(cb) {
          Task.find({
            project: req.params.projectId,
            dueDate: { $ne: null },
            active: true,
          })
            .sort({ dueDate: 1 })
            .exec(cb);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        let tasks = results.nullDueDate.concat(results.isDueDate);
        tasks = tasks.map((task) => task.toObject({ virtuals: true }));
        res.json({ tasks });
      },
    );
  }
});

router.post("/task/add/:projectId", authenticateToken, [
  body("name").trim(),
  body("description").trim(),
  (req, res, next) => {
    let project = null;
    if (req.params.projectId !== "0") {
      project = req.params.projectId;
    }
    const task = new Task({
      name: req.body.name,
      description: req.body.description,
      dueDate: req.body.dueDate,
      repeat: req.body.repeat,
      lastCompleted: null,
      project,
      user: req.user._id,
    });

    task.save((err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: "task added successfully" });
    });
  },
]);

router.get("/task/:taskId", authenticateToken, (req, res, next) => {
  Task.findById(req.params.taskId, (err, task) => {
    if (err) {
      return next(err);
    }
    return res.json({ task });
  });
});

module.exports = router;
