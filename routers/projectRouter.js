// import express module
const express = require('express');
// import database helper
const Projects = require('../data/helpers/projectModel');
// const Actions = require('../data/helpers/actionModel');
// define router
const router = express.Router();

router.get('/:id', validateProjectId, (req, res) => {
   try {
      res.status(200).json(req.project);
   } catch (error) {
      res.status(500).json({ message: 'Oops, something went wrong' });
   }
});

router.get('/:id/actions', validateProjectId, async (req, res) => {
   try {
      const actions = await Projects.getProjectActions(req.project.id);
      res.status(200).json({ success: true, actions })
   } catch (error) {
      res.status(500).json({ message: 'Oops, something went wrong' });
   }
});

router.post('/', validateProject, async (req, res) => {
   try {
      const project = await Projects.insert(req.body)
      res.status(201).json(project)
   } catch (error) {
      res.status(500).json({ message: 'Oops, something went wrong' })
   }
});

router.put('/:id', validateProjectId, validateProject, async (req, res) => {
   try {
      await Projects.update(req.project.id, req.body)
      const project = await Projects.get(req.project.id);
      res.status(200).json({ success: true, project })
   } catch (error) {
      res.status(500).json({ message: 'Oops, something went wrong' });
   }
});

router.delete('/:id', validateProjectId, async (req, res) => {
   try {
      await Projects.remove(req.params.id);
      res.status(200).json({ success: true })
   } catch (error) {
      res.status(500).json({ message: 'Oops, something went wrong' });
   }
});

// custom middleware
async function validateProjectId(req, res, next) {
   let { id } = req.params;
   id = Number(id);
   if (Number.isInteger(id)) {
      req.valid = true;
      const project = await Projects.get(id)
      if (project) {
         req.project = project;
         next();
      } else {
         res.status(404).json({ message: 'the project with that id has entered the Blackhole!' });
      }
   } else {
      res.set('X-Nasty', 'Nasty ID').status(400).json({ message: "that does not look like an id!!" });
   }
};

function validateProject(req, res, next) {
   if (Object.keys(req.body).length !== 0 && req.body.constructor === Object) {
      if (req.body.name && req.body.description) {
         next();
      } else {
         res.status(400).json({ message: "missing required name and/or description fields" })
      }
   } else {
      res.status(400).json({ message: "missing project data" })
   }
};

module.exports = router;