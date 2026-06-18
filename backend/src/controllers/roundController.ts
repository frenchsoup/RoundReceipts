import { Request, Response } from 'express';
import pool from '../db/connection';
import * as roundService from '../services/roundService';
import * as sideGameService from '../services/sideGameService';
import * as rivalryService from '../services/rivalryService';

export async function createRound(req: Request, res: Response) {
  try {
    const { courseId, teeBoxId, holesPlayed } = req.body;
    const scorekeeperId = req.userId!;

    if (!courseId || !teeBoxId) {
      return res.status(400).json({ error: 'Course and tee box required' });
    }

    const round = await roundService.createRound(
      courseId,
      teeBoxId,
      scorekeeperId,
      holesPlayed || 18
    );

    res.status(201).json(round);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create round' });
  }
}

export async function addParticipants(req: Request, res: Response) {
  try {
    const { roundId } = req.params;
    const { participantIds, colors } = req.body;

    if (!participantIds || !Array.isArray(participantIds)) {
      return res.status(400).json({ error: 'Participant IDs required' });
    }

    const participants = [];
    for (let i = 0; i < participantIds.length; i++) {
      const participant = await roundService.addParticipantToRound(
        roundId,
        participantIds[i],
        colors?.[i]
      );
      participants.push(participant);
    }

    res.status(201).json(participants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add participants' });
  }
}

export async function getRound(req: Request, res: Response) {
  try {
    const { roundId } = req.params;

    const round = await roundService.getRoundDetails(roundId);
    if (!round) {
      return res.status(404).json({ error: 'Round not found' });
    }

    const participants = await roundService.getRoundParticipants(roundId);
    const holes = await roundService.getRoundHoles(
      round.teeBoxId,
      round.holesPlayed
    );

    res.json({ ...round, participants, holes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch round' });
  }
}

export async function submitScore(req: Request, res: Response) {
  try {
    const { roundId } = req.params;
    const { holeId, score } = req.body;
    const userId = req.userId!;

    if (!holeId || score === undefined) {
      return res.status(400).json({ error: 'Hole ID and score required' });
    }

    const scoreRecord = await roundService.submitScore(
      roundId,
      holeId,
      userId,
      score
    );

    res.json(scoreRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit score' });
  }
}

export async function getPlayerScores(req: Request, res: Response) {
  try {
    const { roundId, userId } = req.params;

    const scores = await roundService.getPlayerScores(roundId, userId);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
}

export async function completeRound(req: Request, res: Response) {
  try {
    const { roundId } = req.params;
    const userId = req.userId!;

    // Verify user is scorekeeper
    const roundResult = await pool.query(
      'SELECT scorekeeper_id FROM rounds WHERE id = $1',
      [roundId]
    );

    if (roundResult.rows.length === 0) {
      return res.status(404).json({ error: 'Round not found' });
    }

    if (roundResult.rows[0].scorekeeper_id !== userId) {
      return res.status(403).json({ error: 'Only scorekeeper can complete round' });
    }

    const scores = await roundService.calculateRoundResults(roundId);
    const participants = Object.keys(scores);

    // Update rivalries for all pairings
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        const userId1 = participants[i];
        const userId2 = participants[j];
        const score1 = scores[userId1];
        const score2 = scores[userId2];

        let winsUser1 = 0,
          winsUser2 = 0,
          ties = 0;

        if (score1 < score2) {
          winsUser1 = 1;
        } else if (score2 < score1) {
          winsUser2 = 1;
        } else {
          ties = 1;
        }

        const scoreDiff = score1 - score2;

        await rivalryService.updateRivalry(
          userId1,
          userId2,
          winsUser1,
          winsUser2,
          ties,
          scoreDiff
        );
      }
    }

    const completed = await roundService.completeRound(roundId);
    res.json(completed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete round' });
  }
}

export async function recordClosestToPin(req: Request, res: Response) {
  try {
    const { roundId } = req.params;
    const { holeNumber, winnerId, distance } = req.body;

    const sideGame = await sideGameService.recordSideGame(
      roundId,
      'ctp',
      holeNumber,
      winnerId,
      distance
    );

    res.status(201).json(sideGame);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record closest to pin' });
  }
}

export async function recordLongDrive(req: Request, res: Response) {
  try {
    const { roundId } = req.params;
    const { holeNumber, winnerId, distance } = req.body;

    const sideGame = await sideGameService.recordSideGame(
      roundId,
      'long_drive',
      holeNumber,
      winnerId,
      distance
    );

    res.status(201).json(sideGame);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record long drive' });
  }
}

export async function getSideGames(req: Request, res: Response) {
  try {
    const { roundId } = req.params;

    const sideGames = await sideGameService.getSideGamesForRound(roundId);
    res.json(sideGames);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch side games' });
  }
}

export async function getUserRounds(req: Request, res: Response) {
  try {
    const userId = req.userId!;

    const rounds = await roundService.getUserRounds(userId);
    res.json(rounds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rounds' });
  }
}
