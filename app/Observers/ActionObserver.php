<?php

namespace App\Observers;

use App\Models\Action;

class ActionObserver
{
	public function creating(Action $record)
	{
		$action = $record->actionType->inProgress;
		if (!$action) {
			return;
		}

		$action = Action::find($action['id']);
		$action->end_date = $record->start_date;
		$action->save();
	}
}
