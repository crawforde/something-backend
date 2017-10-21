var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  displayName: {
    type: String
  },
  imgUrl: {
    type: String
  },
  bio: {
    type: String
  },
  fbId: {
    type: String
  }
});

var pinSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  displayName: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  }
});

var eventSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  displayName: {
    type: String,
    required: false
  },
  eventDate: {
    type: Date,
    required: false
  },
  eventLocation: {
    type: String,
    required: false
  },
  eventDescription: {
    type: String,
    required: false
  }
});

// the ID of the user that follows the other
// the ID of the user being followed
var followsSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  following: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

userSchema.methods.getFollowRelations = function (callback){
    var youFollow = [];
    var followYou = [];
    var saveUserId = this._id;
    // peopleWhoFollowYou
    Follow.find({following: this._id}).populate('follower').exec(function(err, peopleWhoFollowYou){
      if(err) {
        res.send(err);
      } else {
        // peopleYouFollow
        Follow.find({follower: saveUserId}).populate('following').exec(function(err, peopleYouFollow){
          if (err) {
            res.send(err);
          } else {
            callback(null, peopleYouFollow, peopleWhoFollowYou);
          }
        })
      }
    })
}
// router.get('/messages/:contactId', function(req, res) {
//   Message.find({user: req.user._id, contact: req.params.contactId})
//     .populate('contact').exec(function(error, messages) {
//       if (error) {
//         res.send(error)
//       } else {
//         res.render('messages', {messages: messages})
//       }
//   })
// })

userSchema.methods.isFollowing = function(userId, otherUserId, userDoesFollow) {
  Follow.find({following: this._id, follower: otherUserId},
    function(err, userDoesFollow) {
      if (err) {
        userDoesFollow = false;
        res.send(userDoesFollow);
      } else {
        userDoesFollow = true;
        res.send(userDoesFollow);
      }
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  var newFollow = new Follow ({
    follow: this._id,
    following: idToFollow
  })
  newFollow.save(function(err, result) {
    if(err) {
      callback(err)
    } else {
      callback(null, result)
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.findByIdandRemove({
    follower: this._id,
    following: idToUnfollow
    },
    function(err, foundIdtoRemove) {
      if(err) {
        callback(err)
      } else {
        callback(null, foundIdtoRemove)
      }
    })
}

userSchema.methods.getTweets = function (callback){
  Tweet.find({ user: this._id }),
  function(err, foundTweets) {
    if(err) {
      callback(err)
    } else {
      callback(null, foundTweets)
    }
  }
}

pinSchema.methods.numLikes = function (tweetId, callback){

}


var User = mongoose.model('User', userSchema);
var Pin = mongoose.model('Pin', pinSchema);
var Event = mongoose.model('Event', eventSchema);
var Follow = mongoose.model('Follow', followsSchema);

module.exports = {
  User: User,
  Pin: Pin,
  Event: Event,
  Follow: Follow
};
