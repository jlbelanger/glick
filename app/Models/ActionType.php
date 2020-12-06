<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Jlbelanger\LaravelJsonApi\Traits\Resource;

class ActionType extends Model
{
	use HasFactory, Resource, SoftDeletes;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'user_id',
		'label',
		'is_continuous',
		'field_type',
		'suffix',
		'options',
		'order_num',
	];

	// ========================================================================
	// Attributes
	// ========================================================================

	/**
	 * @return array|null
	 */
	public function getInProgressAttribute()
	{
		if (!$this->is_continuous) {
			return null;
		}
		$actions = $this->actions()->whereNull('end_date')->select(['id', 'start_date', 'value']);
		if (!$actions->exists()) {
			return null;
		}
		$action = $actions->first();
		return [
			'id' => (string) $action->id,
			'start_date' => $action->start_date,
			'value' => $action->value,
		];
	}

	/**
	 * @return string
	 */
	public function getSlugAttribute() : string
	{
		return Str::slug($this->label);
	}

	// ========================================================================
	// JSON API
	// ========================================================================

	/**
	 * @return array
	 */
	public function additionalAttributes() : array
	{
		return ['in_progress', 'slug'];
	}

	/**
	 * @return array
	 */
	public function defaultFilter() : array
	{
		return [
			'user_id' => [
				'eq' => Auth::guard('sanctum')->id(),
			],
		];
	}

	/**
	 * @return array
	 */
	public function defaultSort() : array
	{
		return ['order_num', 'label'];
	}

	/**
	 * @return array
	 */
	protected function rules() : array
	{
		return [
			'attributes.label' => 'required',
			'attributes.field_type' => 'required',
			'relationships.user' => 'required',
		];
	}

	/**
	 * @return array
	 */
	public function singularRelationships() : array
	{
		return ['user'];
	}

	// ========================================================================
	// Mutators
	// ========================================================================

	/**
	 * @param  string|mixed $value
	 * @return void
	 */
	public function setOptionsAttribute($value)
	{
		$value = explode(',', $value);
		$value = array_map('trim', $value);
		$value = implode(', ', $value);
		$this->attributes['options'] = $value;
	}

	// ========================================================================
	// Relationships
	// ========================================================================

	/**
	 * @return HasMany
	 */
	public function actions() : HasMany
	{
		return $this->hasMany('App\Models\Action');
	}

	/**
	 * @return BelongsTo
	 */
	public function user() : BelongsTo
	{
		return $this->belongsTo('App\Models\User');
	}
}
