const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Profile = require('../models/profile');

exports.register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const profile = new Profile({
      userName: req.body.email.toLowerCase(),
      password: hash
    });
    profile.save().then(result => {
      res.status(200).json({
        message: 'user registered',
        result: result
      });
    }).catch(err => {
      res.status(500).json({
        message: 'invalid authentication credentials'
      });
    });
  });
};

exports.validateEmail = (req, res, next) => {
  Profile.findOne({
    'userName': req.params.email.toLowerCase()
  }).then(profile => {
    if (profile) {
      return res.status(200).json({
        emailTaken: true
      });
    } else {
      return res.status(200).json({
        emailTaken: false
      });
    }
  }).catch(err => {
    return res.status(200).json({
      message: 'couldn\'t validate email'
    });
  });
};

exports.login = (req, res, next) => {
  let fetchedProfile;
  Profile.findOne({
    userName: req.body.email.toLowerCase()
  }).then(profile => {
    if (!profile) {
      return res.status(401).json({
        message: 'User does not exist!'
      });
    }
    fetchedProfile = profile;
    return bcrypt.compare(req.body.password, profile.password);
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Email or password incorrect!'
      });
    }
    const token = jwt.sign({
      userName: fetchedProfile.userName,
      userId: fetchedProfile._id
    }, 'rubiks', {
      expiresIn: '1h'
    });
    return res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedProfile._id
    });
  }).catch(err => {
    return res.status(401).json({
      message: 'Invalid credentials!'
    });
  });
};

exports.getProfiles = (req, res, next) => {
  const option = req.query.option;

  const query = {
    _id: {
      $ne: req.query.profileId
    }
  };

  var regex = new RegExp(req.query.query.replace(/\s*,\s*/g, '|',), 'gi');
  if (option.toLowerCase() === 'interests') {
    query.interests = regex;
  } else if (option.toLowerCase() === 'state') {
    query.state = regex;
  }

  Profile.find(query, {
    _id: 0,
    password: 0,
    __v: 0
  }, {
    sort: {
      firstName: 1,
      lastName: 1
    }
  }).then(profiles => {
    res.status(200).json({
      profiles: profiles
    });
  }).catch(err => {
    res.status(500).json({
      message: 'Fetching profiles failed!'
    });
  });
};

exports.getProfile = (req, res, next) => {
  Profile.findById(req.params.id).then(profile => {
    if (profile) {
      res.status(200).json(profile);
    } else {
      res.status(404).json({
        message: 'Profile not found!'
      });
    }
  }).catch(err => {
    res.status(500).json({
      message: 'Fetching profile failed!'
    });
  });
};

exports.updateProfile = (req, res, next) => {
  let imagePath = req.body.profileImage;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const profile = new Profile({
    _id: req.body.id.trim(),
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim(),
    profileImage: imagePath.trim(),
    interests: req.body.interests.trim(),
    state: req.body.state.trim()
  });
  Profile.findByIdAndUpdate({
    _id: req.params.id
  }, profile, {
    runValidators: false,
    useFindAndModify: true
  }).then(result => {
    if (result) {
      return res.status(200).json({
        updated: true,
        message: 'Update successful!'
      });
    } else {
      return res.status(401).json({
        updated: false,
        message: 'Unauthorized!'
      });
    }
  }).catch(err => {
    console.log(err);
    return res.status(500).json({
      updated: false,
      message: 'Unable to update profile!'
    });
  });
};
