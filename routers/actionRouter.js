// import express module
const express = require('express');
// import database helper
const Projects = require('../data/helpers/projectModel');
const Actions = require('../data/helpers/actionModel');
// define router
const router = express.Router();

router.get('/:id', validateActionId, (req, res) => {
   try {
      res.status(200).json(req.action);
   } catch (error) {
      res.status(500).json({ message: 'Oops, something went wrong' });
   }
});

router.post('/', validateAction, async (req, res) => {
   try {
      const action = await Actions.insert(req.body)
      res.status(201).json(action)
   } catch (error) {
      res.status(500).json({ message: 'Oops, something went wrong' })
   }
});

router.put('/:id', validateActionId, validateAction, async (req, res) => {
   try {
      await Actions.update(req.action.id, req.body)
      const action = await Actions.get(req.action.id);
      res.status(200).json({ success: true, action })
   } catch (error) {
      res.status(500).json({ message: 'Oops, something went wrong' })
   }
});

router.delete('/:id', validateActionId, async (req, res) => {
   try {
      await Actions.remove(req.action.id);
      res.status(200).json({ success: true })
   } catch (error) {
      res.status(500).json({ message: 'Oops, something went wrong' })
   }
});

// custom middleware
async function validateActionId(req, res, next) {
   let { id } = req.params;
   id = Number(id);
   if (Number.isInteger(id)) {
      req.valid = true;
      const action = await Actions.get(id)
      if (action) {
         req.action = action;
         next();
      }
      else {
         res.status(404).json({ message: 'the action with that id has entered the Blackhole!' });
      }
   } else {
      res.set('X-Nasty', 'Nasty ID').status(400).json({ message: "that does not look like an id!!" });
   }
}

async function validateAction(req, res, next) {
   if (Object.keys(req.body).length !== 0 && req.body.constructor === Object) {
      if (req.body.project_id && req.body.description && req.body.notes) {
         const project = await Projects.get(req.body.project_id);
         if (project) {
            next();
         } else {
            res.status(400).json({ message: "project id does not exist" })
         }
      } else {
         res.status(400).json({ message: "missing required notes and/or description and/or project_id fields" })
      }
   } else {
      res.status(400).json({ message: "missing action data" })
   }
};

module.exports = router;