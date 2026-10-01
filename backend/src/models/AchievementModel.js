const db = require('../config/database');

class AchievementModel {
  static getAllAchievements(req) {
    const medals = db.prepare('SELECT * FROM achievements_nationalmedal ORDER BY year DESC, id DESC').all();
    const players = db.prepare('SELECT * FROM achievements_playerachievement ORDER BY created_at DESC, id DESC').all();
    const coaches = db.prepare('SELECT * FROM achievements_coachachievement ORDER BY created_at DESC, id DESC').all();
    const awards = db.prepare('SELECT * FROM achievements_federationaward ORDER BY year DESC, id DESC').all();

    // Include tournament results uploaded by admin
    let tournament_results = [];
    try {
      const results = db.prepare(`
        SELECT r.*, e.name AS event_name, e.location AS event_location, e.category AS event_category, e.start_date AS event_start_date
        FROM events_tournamentresult r
        LEFT JOIN events_event e ON r.event_id = e.id
        ORDER BY e.start_date DESC
      `).all();

      const getStandingsStmt = db.prepare('SELECT position, team_name, notes FROM events_tournamentstanding WHERE event_id = ? ORDER BY position ASC');

      tournament_results = results.map((result) => {
        const standings = getStandingsStmt.all(result.event_id);
        return {
          event_id: result.event_id,
          event_name: result.event_name,
          event_location: result.event_location,
          event_category: result.event_category,
          final_date: result.final_date ? String(result.final_date) : null,
          total_matches: result.total_matches,
          top_scorer: result.top_scorer,
          best_player: result.best_player,
          best_goalkeeper: result.best_goalkeeper,
          most_promising_junior: result.most_promising_junior,
          uploaded_at: result.uploaded_at ? new Date(result.uploaded_at).toISOString() : new Date().toISOString(),
          standings,
        };
      });
    } catch (err) {
      console.error('[AchievementModel] Error fetching tournament results:', err.message);
    }

    return {
      players,
      coaches,
      awards,
      medals,
      tournament_results,
    };
  }

  // Medals CRUD
  static addMedal(data) {
    const stmt = db.prepare(`
      INSERT INTO achievements_nationalmedal (year, medal_type, title, description, category, result, created_at)
      VALUES (@year, @medal_type, @title, @description, @category, @result, datetime('now'))
    `);
    const info = stmt.run({
      year: String(data.year || ''),
      medal_type: data.medal_type,
      title: data.title || '',
      description: data.description || '',
      category: data.category || '',
      result: data.result || '',
    });
    return db.prepare('SELECT * FROM achievements_nationalmedal WHERE id = ?').get(info.lastInsertRowid);
  }

  static updateMedal(data) {
    db.prepare(`
      UPDATE achievements_nationalmedal
      SET year = @year, medal_type = @medal_type, title = @title, description = @description, category = @category, result = @result
      WHERE id = @id
    `).run({
      id: Number(data.id),
      year: String(data.year || ''),
      medal_type: data.medal_type,
      title: data.title || '',
      description: data.description || '',
      category: data.category || '',
      result: data.result || '',
    });
    return db.prepare('SELECT * FROM achievements_nationalmedal WHERE id = ?').get(Number(data.id));
  }

  static deleteMedal(id) {
    return db.prepare('DELETE FROM achievements_nationalmedal WHERE id = ?').run(Number(id));
  }

  // Player Achievements CRUD
  static addPlayerAchievement(data) {
    const stmt = db.prepare(`
      INSERT INTO achievements_playerachievement (name, district, position, player_id_str, event_name, event_location, description, category_tag, color_theme, created_at)
      VALUES (@name, @district, @position, @player_id_str, @event_name, @event_location, @description, @category_tag, @color_theme, datetime('now'))
    `);
    const info = stmt.run({
      name: data.name || '',
      district: data.district || '',
      position: data.position || '',
      player_id_str: data.player_id_str || '',
      event_name: data.event_name || '',
      event_location: data.event_location || '',
      description: data.description || '',
      category_tag: data.category_tag || '',
      color_theme: data.color_theme || 'blue',
    });
    return db.prepare('SELECT * FROM achievements_playerachievement WHERE id = ?').get(info.lastInsertRowid);
  }

  static updatePlayerAchievement(data) {
    db.prepare(`
      UPDATE achievements_playerachievement
      SET name = @name, district = @district, position = @position, player_id_str = @player_id_str,
          event_name = @event_name, event_location = @event_location, description = @description,
          category_tag = @category_tag, color_theme = @color_theme
      WHERE id = @id
    `).run({
      id: Number(data.id),
      name: data.name || '',
      district: data.district || '',
      position: data.position || '',
      player_id_str: data.player_id_str || '',
      event_name: data.event_name || '',
      event_location: data.event_location || '',
      description: data.description || '',
      category_tag: data.category_tag || '',
      color_theme: data.color_theme || 'blue',
    });
    return db.prepare('SELECT * FROM achievements_playerachievement WHERE id = ?').get(Number(data.id));
  }

  static deletePlayerAchievement(id) {
    return db.prepare('DELETE FROM achievements_playerachievement WHERE id = ?').run(Number(id));
  }

  // Coach Achievements CRUD
  static addCoachAchievement(data) {
    const stmt = db.prepare(`
      INSERT INTO achievements_coachachievement (name, award_name, year, role_description, coach_id_str, created_at)
      VALUES (@name, @award_name, @year, @role_description, @coach_id_str, datetime('now'))
    `);
    const info = stmt.run({
      name: data.name || '',
      award_name: data.award_name || '',
      year: String(data.year || ''),
      role_description: data.role_description || '',
      coach_id_str: data.coach_id_str || '',
    });
    return db.prepare('SELECT * FROM achievements_coachachievement WHERE id = ?').get(info.lastInsertRowid);
  }

  static updateCoachAchievement(data) {
    db.prepare(`
      UPDATE achievements_coachachievement
      SET name = @name, award_name = @award_name, year = @year,
          role_description = @role_description, coach_id_str = @coach_id_str
      WHERE id = @id
    `).run({
      id: Number(data.id),
      name: data.name || '',
      award_name: data.award_name || '',
      year: String(data.year || ''),
      role_description: data.role_description || '',
      coach_id_str: data.coach_id_str || '',
    });
    return db.prepare('SELECT * FROM achievements_coachachievement WHERE id = ?').get(Number(data.id));
  }

  static deleteCoachAchievement(id) {
    return db.prepare('DELETE FROM achievements_coachachievement WHERE id = ?').run(Number(id));
  }

  // Federation Awards CRUD
  static addAward(data) {
    const stmt = db.prepare(`
      INSERT INTO achievements_federationaward (year, award_name, awarded_by, created_at)
      VALUES (@year, @award_name, @awarded_by, datetime('now'))
    `);
    const info = stmt.run({
      year: String(data.year || ''),
      award_name: data.award_name || '',
      awarded_by: data.awarded_by || '',
    });
    return db.prepare('SELECT * FROM achievements_federationaward WHERE id = ?').get(info.lastInsertRowid);
  }

  static updateAward(data) {
    db.prepare(`
      UPDATE achievements_federationaward
      SET year = @year, award_name = @award_name, awarded_by = @awarded_by
      WHERE id = @id
    `).run({
      id: Number(data.id),
      year: String(data.year || ''),
      award_name: data.award_name || '',
      awarded_by: data.awarded_by || '',
    });
    return db.prepare('SELECT * FROM achievements_federationaward WHERE id = ?').get(Number(data.id));
  }

  static deleteAward(id) {
    return db.prepare('DELETE FROM achievements_federationaward WHERE id = ?').run(Number(id));
  }
}

module.exports = AchievementModel;
