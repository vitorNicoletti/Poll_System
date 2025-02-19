USE vote_sistem;
DROP PROCEDURE IF EXISTS deletePoll;
DELIMITER //

CREATE PROCEDURE deletePoll(IN idPoll INT)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION 
	BEGIN
		-- Insere um log de erro antes de desfazer a transação
		INSERT INTO error_logs (message, created_at) 
		VALUES ('Erro ao deletar uma enquete', NOW());
		
		-- Desfaz todas as alterações
		ROLLBACK;
	END;
    
    
	START TRANSACTION;
    
	DELETE FROM `options` WHERE id_poll = idPoll;
    DELETE FROM polls WHERE id = idPoll;
    
    COMMIT;
END //
DELIMITER ;
