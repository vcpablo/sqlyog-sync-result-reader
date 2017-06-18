$(document).ready(function() {
    var getContent = function getContent(result) {
        var content = '<div class="panel-body">';

        if (result.isError) {
            content += '<p><strong>Query:</strong> ' + result.query + '</p>' +
                '<p>';
        }
        if (result.rows) {
            content += '<p><strong>Linhas afetadas:</strong> ' + result.rows + '</p>';
        }
        content += '<strong>Tempo de Execução:</strong> ' + result.executionTime + '<br> ' +
            '<strong>Tempo de Total:</strong> ' + result.totalTime + '<br> ' +
            '</p>' +
            '</div></div>';

        return content;
    };
    var printResult = function printResult(results) {
        var errorsHtml = [],
            warningsHtml = [],
            messagesHtml = [],
            html;

        results.forEach(function(result) {
            html = '';

            if (result.isError) {
                html += '<div class="panel panel-danger">' +
                    '<div class="panel-heading"><strong>' + result.error + '</strong></div>';
                html += getContent(result);

                errorsHtml.push(html);
            } else if (result.isWarning) {
                html += '<div class="panel panel-warning">' +
                    '<div class="panel-heading"><strong>' + result.query + '</strong></div>';
                html += getContent(result);

                warningsHtml.push(html);
            } else if (result.isMessage) {
                
                html += '<div class="panel panel-primary">' +
                    '<div class="panel-heading"><strong>' + result.query + '</strong></div>';

                html += getContent(result);
                messagesHtml.push(html);
            }

        });

        if (results.length > 0) {
        	if(errorsHtml.length == 0 && warningsHtml.length == 0 && messagesHtml.length == 0) {
				$('#no-results').removeClass('hidden');
            } else {
	        	
	            if (errorsHtml.length > 0) {
	                $('a[href="#errors"]').removeClass('hidden').click();
                    $('#errors').html(errorsHtml.join('')).removeClass('hidden');

                    $('#totalErrors').text(errorsHtml.length);
                } else {
                    $('a[href="#errors"]').addClass('hidden');
	                $('#errors').html('').addClass('hidden');
                }
	            
	            if (warningsHtml.length > 0) {
                    $('a[href="#warnings"]').removeClass('hidden');

                    if (errorsHtml.length == 0) {
                        $('a[href="#warnings"]').click()
	                }
	                $('#warnings').html(warningsHtml.join('')).removeClass('hidden');

	                $('#totalWarnings').text(warningsHtml.length);

	            } else {
                    $('a[href="#warnings"]').addClass('hidden');
                    $('#warnings').html('').addClass('hidden');
                }
	            
	            if (messagesHtml.length > 0) {
                    $('a[href="#messages"]').removeClass('hidden');
	                if (errorsHtml.length == 0 && warningsHtml.length == 0) {
	                    $('a[href="#messages"]').click();
	                }

	                $('#messages').html(messagesHtml.join('')).removeClass('hidden');

	                $('#totalMessages').text(messagesHtml.length);
	            } else  {
                     $('a[href="#messages"]').addClass('hidden');
                    $('#messages').html('').addClass('hidden');
                }

	            $('#results').removeClass('hidden');
            	
            }




        }

        $('#loading').addClass('hidden');
        

    };

    var processOutput = function processOutput() {
        var output = $('#output').val();

        if (output.trim() == '') {
            $('#output').parent().addClass('has-error');
            return;
        };

        $('#loading').removeClass('hidden');
        $('#results').addClass('hidden');
        $('#no-results').addClass('hidden');


        var query, rows, executionTime, transferTime, totalTime, error, results = [];

        output = output.split('-----------------------------------------------------------').map(function(line) {


            var result = {
                isError: (line.indexOf('Error Code') !== -1),
                isWarning: (line.indexOf('warning(s)') !== -1),
            };

            result.isMessage = !result.isError && !result.isWarning && (line.indexOf('Query:') !== -1);

            var splitLine = line.split('\n').filter(function(contentLine) {
                return contentLine !== '';
            });

            splitLine.forEach(function(eachLine, index) {
                // Query
                if (eachLine.indexOf('Query') === 0) {
                    result.query = eachLine;
                } else if (eachLine.indexOf('Execution') === 0) {
                    result.executionTime = eachLine;
                } else if (eachLine.indexOf('Transfer') === 0) {
                    result.transferTime = eachLine;
                } else if (eachLine.indexOf('Total') === 0) {
                    result.totalTime = eachLine;
                } else if (eachLine.indexOf('Error') === 0) {
                    result.error = eachLine + ' - ' + splitLine[index + 1];
                } else if (eachLine.indexOf('row(s) affected') !== -1) {
                    result.rows = eachLine;
                }


            });

            results.push(result);

        });

        printResult(results);
    };



    $('#process').click(processOutput);

});
