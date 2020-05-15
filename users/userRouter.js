const express = require('express');
const db= require('./userDb');
const postdb= require('../posts/postDb')
const router = express.Router();



router.post('/', validateUser,(req, res) => {
  db.insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
     
      console.log(error);
      res.status(500).json({
        message: 'Error adding the user',
      });
    });
});

router.post('/:id/posts', validatePost, (req, res) => {
    postdb.insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error adding the post',
      });
    });
});

router.get('/', (req, res) => {
  
    db.get(req.query)
    .then(d => {
      res.status(200).json(d);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the db',
      });
    });
  });

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user);
  db.getById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'post not found' });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the post',
      });
    });
});

router.get('/:id/posts',validateUserId, (req, res) => {
  postdb.getById(req.params.id)
  .then(comment => {
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({ message: 'message not found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the message',
    });
  });
});

router.delete('/:id', (req, res) => {
  db.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'The post has been removed' });
    } else {
      res.status(404).json({ message: 'The post could not be found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error removing the post',
    });
  });});

router.put('/:id', (req, res) => {
  const changes = req.body;
  db.update(req.params.id, changes)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'The post could not be found' });
    }
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: 'Error updating the post',
    });
  });});




//custom middleware

function validateUserId(req, res, next) {
  const {id} = req.params;

  db.getById(id)
  .then(user => {
    if (user) {
    req.user = user;
    next()
    } else {
      res.status(404).json({message:"post not found(from validateid) not found"})
    }
  })
  .catch(err =>{
    res.status(500).json({message:"nope", error:err})
  }
  );

}

function validateUser(req, res, next) {
 if (!req.body.id) {
  res.status(400).json({message:"missing body (from validateUser) "});
 }else if (!req.body.name){
  res.status(400).json({message:"missing user name (from validateUser) "});
 }else {
  next();
 }
}

function validatePost(req, res, next) {
  if (req.body.text) {
   next();
  }else {
   res.status(400).json({message:"missing post text (from validatePost) "});
  }
}

module.exports = router;
